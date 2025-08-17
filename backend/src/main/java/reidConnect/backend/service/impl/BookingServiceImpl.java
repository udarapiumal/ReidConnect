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

        VenueBookingResponseDto dto = new VenueBookingResponseDto();
        dto.setClubId(club.getId());
        dto.setClubName(booking.getClubName());
        dto.setRegistrationNumber(booking.getRegistrationNumber());
        dto.setContactNumber(booking.getContactNumber());
        dto.setVenueId(booking.getVenue().getId());
        dto.setSlotIds(req.getSlotIds());
        dto.setDate(booking.getDate());
        dto.setReason(booking.getReason());

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
        String slots = b.getSlots().stream()
                .map(s -> s.getStartTime() + " - " + s.getEndTime())
                .reduce((a, b2) -> a + ", " + b2).orElse("-");

        Club club = clubRepository.findById(b.getClubId().getId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        return """
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"><title>Venue Booking</title></head>
                <body style="font-family: Arial, sans-serif;">
                  <h2>Venue Booking Request #%d</h2>
                  <p><b>Club:</b> %s (ID: %d)</p>
                  <p><b>Registration No:</b> %s</p>
                  <p><b>Contact:</b> %s</p>
                  <p><b>Venue:</b> %s</p>
                  <p><b>Date:</b> %s</p>
                  <p><b>Slots:</b> %s</p>
                  <p><b>Reason:</b> %s</p>

                  <h3>Club Acceptance</h3>
                  <p>I accept the terms and conditions. Check to accept: <span>##TERMS_CHECK##</span></p>
                  <p>Signature (Club): <span>##CLUB_SIGN##</span></p>

                  <h3>SAR Decision</h3>
                  <p>Signature (SAR): <span>##SAR_SIGN##</span></p>
                  <h3>UNION Sign</h3>
                  <p>Signature (Union): <span>##UNION_SIGN##</span></p>
                  <h3>DEPUTY DIRECTOR Sign</h3>
                  <p>Signature (Deputy Director): <span>##DEPUTY_SIGN##</span></p>
                
                </body></html>
                """.formatted(
                b.getId(), b.getClubName(), club.getId(),
                b.getRegistrationNumber(), b.getContactNumber(),
                b.getVenue().getName(), df.format(b.getDate()), slots, b.getReason());
    }
}
