package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.BookingStatus;
import reidConnect.backend.repository.ClubRepository;
import reidConnect.backend.repository.SlotRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.repository.VenueBookingRepository;
import reidConnect.backend.service.BookingService;
import reidConnect.backend.service.DocusignService;
import reidConnect.backend.service.VenueService;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final ClubRepository clubRepository;
    private final VenueBookingRepository repo;
    private final SlotRepository slotRepo;
    private final DocusignService ds;
    private final VenueService venueService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public VenueBookingResponseDto createBookingAndEnvelope(VenueBookingRequestDto req) throws Exception {
        Venue venue = venueService.getEntityById(req.getVenueId());
        List<Slot> slots = slotRepo.findAllById(req.getSlotIds());

        Club club = clubRepository.findById(req.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        VenueBooking booking = new VenueBooking();
        booking.setVenue(venue);
        booking.setSlots(slots);
        booking.setClubId(club);
        booking.setClubName(req.getClubName());
        booking.setRegistrationNumber(req.getRegistrationNumber());
        booking.setContactNumber(req.getContactNumber());
        booking.setDate(req.getDate());
        booking.setReason(req.getReason());
        booking.setStatus(BookingStatus.PENDING);
        repo.save(booking);

        String html = buildHtml(booking);

        //fetches the SAR account from the database
        User sarUser = userRepository.findByRole("academic_sar")
                .orElseThrow(() -> new RuntimeException("SAR account not found"));

        User clubUser = club.getUser();

        // Union
        User unionUser = userRepository.findByRole("union")
                .orElseThrow(() -> new RuntimeException("Union account not found"));

        // Academic Deputy Director
        User deputyUser = userRepository.findByRole("academic_deputy_director")
                .orElseThrow(() -> new RuntimeException("Deputy Director account not found"));


        //Creating an envelope with Docusign tabs
        String envelopeId = ds.createEnvelopeForBooking(
                booking.getId(),
                html,
                req.getClubName(), clubUser.getEmail(), "1",   // Club
                sarUser.getName(), sarUser.getEmail(), "2",    // SAR
                unionUser.getName(), unionUser.getEmail(), "3",// Union
                deputyUser.getName(), deputyUser.getEmail(), "4" // Deputy Director
        );


        booking.setEnvelopeId(envelopeId);
        repo.save(booking);

        VenueBookingResponseDto dto = toDto(booking);
        dto.setClubId(club.getId());
        dto.setClubName(booking.getClubName());
        dto.setRegistrationNumber(booking.getRegistrationNumber());
        dto.setContactNumber(booking.getContactNumber());
        dto.setVenueId(booking.getVenue().getId());
        dto.setSlotIds(req.getSlotIds());
        dto.setDate(booking.getDate());
        dto.setReason(booking.getReason());
        dto.setStatus(booking.getStatus());
        dto.setEnvelopeId(booking.getEnvelopeId());

        return dto;
    }

    @Override
    public String getEmbeddedSigningUrlForClub(Long bookingId, String clubName, String clubEmail) throws Exception {
        VenueBooking b = repo.findById(bookingId).orElseThrow();
        return ds.createRecipientViewUrl(b.getEnvelopeId(), clubName, clubEmail, "1", "club");
    }

    @Override
    public String getEmbeddedSigningUrlForSar(Long bookingId, String sarName, String sarEmail) throws Exception {
        VenueBooking b = repo.findById(bookingId).orElseThrow();
        return ds.createRecipientViewUrl(b.getEnvelopeId(), sarName, sarEmail, "2", "sar");
    }

    @Override
    public String getEmbeddedSigningUrlForUnion(Long bookingId) throws Exception {
        VenueBooking b = repo.findById(bookingId).orElseThrow();
        User unionUser = userRepository.findByRole("union")
                .orElseThrow(() -> new RuntimeException("Union account not found"));
        return ds.createRecipientViewUrl(b.getEnvelopeId(), unionUser.getName(), unionUser.getEmail(), "3", "union");
    }

    @Override
    public String getEmbeddedSigningUrlForDeputy(Long bookingId) throws Exception {
        VenueBooking b = repo.findById(bookingId).orElseThrow();
        User deputyUser = userRepository.findByRole("academic_deputy_director")
                .orElseThrow(() -> new RuntimeException("Deputy Director account not found"));
        return ds.createRecipientViewUrl(b.getEnvelopeId(), deputyUser.getName(), deputyUser.getEmail(), "4", "deputy");
    }


    @Override
    @Transactional
    public void updateStatusFromEnvelope(Long bookingId) throws Exception {
        VenueBooking b = repo.findById(bookingId).orElseThrow();

        String envelopeStatus = ds.getEnvelopeStatus(b.getEnvelopeId());
        System.out.println("Envelope status: " + envelopeStatus);

        if ("declined".equalsIgnoreCase(envelopeStatus) || "voided".equalsIgnoreCase(envelopeStatus)) {
            b.setStatus(BookingStatus.REJECTED);
            repo.save(b);
            return;
        }

        // Fetch recipient status from DocuSign
        Map<String, String> recipientStatus = ds.getRecipientStatus(b.getEnvelopeId());
        System.out.println("Recipient status: " + recipientStatus);

        boolean clubSigned = "completed".equalsIgnoreCase(recipientStatus.get("1"));
        boolean sarSigned = "completed".equalsIgnoreCase(recipientStatus.get("2"));
        boolean unionSigned = "completed".equalsIgnoreCase(recipientStatus.get("3"));
        boolean deputySigned = "completed".equalsIgnoreCase(recipientStatus.get("4"));

        // Update booking status based on who signed
        if (clubSigned && sarSigned && unionSigned && deputySigned) {
            b.setStatus(BookingStatus.APPROVED);
        } else if (clubSigned && sarSigned && unionSigned) {
            b.setStatus(BookingStatus.UNION_SIGNED);
        } else if (clubSigned && sarSigned) {
            b.setStatus(BookingStatus.SAR_SIGNED);
        } else {
            b.setStatus(BookingStatus.PENDING);
        }


        repo.save(b);
        System.out.println("Booking status updated to: " + b.getStatus());
    }

    @Override
    public byte[] downloadSignedPdf(Long bookingId) throws Exception {
        VenueBooking b = repo.findById(bookingId).orElseThrow();
        return ds.downloadCombinedDocument(b.getEnvelopeId());
    }

    @Override
    public Long findBookingIdByEnvelopeId(String envelopeId) {
        return repo.findByEnvelopeId(envelopeId)
                .map(VenueBooking::getId)
                .orElseThrow(() -> new RuntimeException("Booking not found for envelopeId " + envelopeId));
    }


    private String buildHtml(VenueBooking b) {
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String today = LocalDate.now().format(df);

        String slots = b.getSlots().stream()
                .map(s -> s.getStartTime() + " - " + s.getEndTime())
                .reduce((a, b2) -> a + ", " + b2).orElse("-");

        Club club = clubRepository.findById(b.getClubId().getId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hall Booking Request</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .form-container {
                    background-color: white;
                    padding: 20px;
                    border: 2px solid black;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .university-name {
                    font-weight: bold;
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                .department {
                    font-size: 12px;
                    margin-bottom: 15px;
                }
                .form-title {
                    font-weight: bold;
                    font-size: 14px;
                    margin-bottom: 10px;
                    text-decoration: underline;
                }
                .form-subtitle {
                    font-size: 11px;
                    margin-bottom: 20px;
                    font-style: italic;
                }
                table {
                    width: 100%%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table, th, td {
                    border: 1px solid black;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    font-size: 11px;
                }
                th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                .booking-table th {
                    text-align: center;
                    font-size: 10px;
                    vertical-align: middle;
                }
                .booking-table td {
                    height: 30px;
                    vertical-align: top;
                }
                .availability-cell {
                    padding: 0;
                }
                .nested-table{
                    width: 100%%;
                    border: none;
                    margin: 0;
                    border-collapse: collapse;
                }
                 .nested-table td {
                    border: 1px solid black;
                    width: 50%%;
                    height: 25px;
                    text-align: center;
                    font-size: 9px;
                    padding: 2px;
                }
                .yes-no-label {
                    font-weight: bold;
                }
                .declaration {
                    font-size: 11px;
                    margin-bottom: 20px;
                    text-align: justify;
                    line-height: 1.3;
                }
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                .signature-left, .signature-right {
                    width: 48%%;
                }
                .signature-line {
                    border-bottom: 1px dotted black;
                    display: inline-block;
                    width: 200px;
                    margin: 0 5px;
                }
                .club-acceptance {
                    margin-bottom: 20px;
                    font-size: 11px;
                }
                .approval-section {
                    border-top: 1px solid black;
                    padding-top: 15px;
                    margin-top: 20px;
                }
                .approval-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    align-items: flex-start;
                }
                .approval-left {
                    font-size: 11px;
                    width: 48%%;
                }
                .approval-right {
                    font-size: 11px;
                    text-align: right;
                    width: 48%%;
                }
                .office-use {
                    font-style: italic;
                    font-size: 10px;
                    text-align: right;
                    margin-bottom: 10px;
                }
                .final-signature {
                    text-align: right;
                    font-size: 11px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="form-container">
                <div class="header">
                    <div class="university-name">UNIVERSITY OF COLOMBO SCHOOL OF COMPUTING (UCSC)</div>
                    <div class="department">Academic and Publications Branch</div>
                    <div class="form-title">REQUEST FORM FOR HALL BOOKING</div>
                    <div class="form-subtitle">
                        W003/Affron/501A/E203/E401(5th Floor)/E205/Mini Auditorium/E202(IBGUE Hall)<br>
                        Separate forms should be submitted for different halls, but relevant parts above leaving required hall)
                    </div>
                </div>

                <table class="booking-table">
                    <thead>
                        <tr>
                            <th>Requested Hall</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason and approval<br>given if any</th>
                            <th>Availability YES/NO<br>(Certified by booking Clerk<br>at AHB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>%s</td>
                            <td>%s</td>
                            <td>%s</td>
                            <td>%s</td>
                            <td class="availability-cell">
                                <table class="nested-table">
                                    <tr>
                                        <td class="yes-no-label">Yes/No</td>
                                        <td>Signature</td>
                                    </tr>
                                </table>
                                <table class="nested-table">
                                    <tr>
                                        <td class="yes-no-label"></td>
                                        <td></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="declaration">
                    <strong>Declaration of the Applicant:</strong><br>
                    I undertake the responsibility of booking and will take care of all assets in the room during the booking. I will not 
                    change seats in the Hall (technical settings or physical locations) without permission. I agree to pay compensation 
                    to UCSC due to any damages. Check to accept terms: ##TERMS_CHECK##
                </div>

                <div class="signature-section">
                    <div class="signature-left">
                        <div style="margin-bottom: 10px;">
                            Name of Applicant: %s
                        </div>
                        <div style="margin-bottom: 10px;">
                            Registration Number: %s
                        </div>
                        <div>
                            Contact Number (Phone): %s
                        </div>
                    </div>
                    <div class="signature-right">
                        <div style="margin-bottom: 10px;">
                            Signature of the Applicant: <span class="signature-line">##CLUB_SIGN##</span>
                        </div>
                        <div>
                            Date: %s
                        </div>
                    </div>
                </div>

                <div class="approval-section">
                    <div class="office-use">For office use only</div>
                    
                    <div class="approval-item">
                        <div class="approval-left">
                            <strong>1. I recommend the above request</strong><br><br>
                            <span class="signature-line">##SAR_SIGN##</span><br>
                            SAR / Coordinator/Adviser
                        </div>
                        <div class="approval-right">
                            <strong>2. Approval is granted</strong><br><br>
                            <span class="signature-line">##UNION_SIGN##</span><br>
                            Director/Deputy Director/Head - Date: <span class="signature-line"></span>
                        </div>
                    </div>

                    <div class="approval-item">
                        <div class="approval-left">
                            <strong>3. Assignment of lecture Hall</strong><br><br>
                            <span class="signature-line">##DEPUTY_SIGN##</span> Date: <span class="signature-line"></span><br>
                        </div>
                        <div class="approval-right">
                            Assigning caretaker<br><br>
                            <span class="signature-line"></span> Date: <span class="signature-line"></span><br>
                            <br>
                            <strong>DR. SARKAR</strong><br>
                            General Administration
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
                b.getVenue().getName(), df.format(b.getDate()), slots, b.getReason(),
                b.getClubName(),b.getRegistrationNumber(), b.getContactNumber(), today) ;
    }

    @Override
    public List<VenueBookingResponseDto> getAllBookings() {
        return repo.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<VenueBookingResponseDto> getBookingsByStatus(BookingStatus status) {
        return repo.findByStatus(status).stream()
                .map(this::toDto)
                .toList();
    }

    private VenueBookingResponseDto toDto(VenueBooking booking) {
        VenueBookingResponseDto dto = new VenueBookingResponseDto();
        dto.setId(booking.getId());
        dto.setClubId(booking.getClubId().getId());
        dto.setClubName(booking.getClubName());
        dto.setRegistrationNumber(booking.getRegistrationNumber());
        dto.setContactNumber(booking.getContactNumber());
        dto.setVenueId(booking.getVenue().getId());
        dto.setSlotIds(booking.getSlots().stream().map(Slot::getId).toList());
        dto.setDate(booking.getDate());
        dto.setReason(booking.getReason());

        // 🔹 Missing fields
        dto.setStatus(booking.getStatus());
        dto.setEnvelopeId(booking.getEnvelopeId());

        return dto;
    }


}
