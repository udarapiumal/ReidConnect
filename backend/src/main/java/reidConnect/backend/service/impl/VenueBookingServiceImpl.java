package reidConnect.backend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.venue.DashboardStatsDto;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.dto.venue.VenueBookingSummaryDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.BookingStatus;
import reidConnect.backend.mapper.VenueBookingMapper;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.VenueBookingService;
import reidConnect.backend.util.KeyUtil;

import java.security.*;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueBookingServiceImpl implements VenueBookingService {

    private final VenueBookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;
    private final KeyStoreRepository keyStoreRepository;
    private final VenueBookingMapper bookingMapper;

    // Inject Spring's pre-configured ObjectMapper
    private final ObjectMapper objectMapper;

    @Override
    public VenueBookingResponseDto createBooking(Long clubUserId, VenueBookingRequestDto dto) {
        try {
            User club = userRepository.findById(clubUserId)
                    .orElseThrow(() -> new RuntimeException("User Id for Club not found"));
            KeyStoreEntity clubKeyStore = keyStoreRepository.findByUserId(clubUserId);

            // Decrypt the club private key
            PrivateKey clubPrivateKey = KeyUtil.decryptPrivateKey(clubKeyStore.getPrivateKey());

            //Exclude the signature image
            ObjectNode node = objectMapper.valueToTree(dto);
            node.remove("clubSignatureImage");

            // Serialize booking data
            String bookingDataJson = objectMapper.writeValueAsString(node);

            // Sign the booking data
            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initSign(clubPrivateKey);
            signature.update(bookingDataJson.getBytes());
            String clubSignature = Base64.getEncoder().encodeToString(signature.sign());

            // Save booking
            VenueBooking booking = new VenueBooking();
            booking.setVenue(venueRepository.findById(dto.getVenueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found")));
            booking.setSlots(slotRepository.findAllById(dto.getSlotIds()));
            booking.setClub(club);
            booking.setClubName(dto.getClubName());
            booking.setRegistrationNumber(dto.getRegistrationNumber());
            booking.setContactNumber(dto.getContactNumber());
            booking.setDate(dto.getDate());
            booking.setReason(dto.getReason());
            booking.setBookingData(bookingDataJson);
            booking.setClubSignature(clubSignature);

            // Add null safety and validation for signature image
            if (dto.getClubSignatureImage() != null && !dto.getClubSignatureImage().trim().isEmpty()) {
                try {
                    booking.setClubSignatureImage(Base64.getDecoder().decode(dto.getClubSignatureImage()));
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid Base64 format for club signature image", e);
                }
            } else {
                booking.setClubSignatureImage(null);
            }

            booking.setStatus(BookingStatus.PENDING);

            VenueBooking savedBooking = bookingRepository.save(booking);

            // Map to DTO
            return bookingMapper.toDto(savedBooking);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create booking", e);
        }
    }

    @Override
    public VenueBookingResponseDto approveBooking(Long sarId, Long bookingId, String sarSignatureImg) {
        try {
            User sar = userRepository.findById(sarId)
                    .orElseThrow(() -> new RuntimeException("SAR not found"));
            KeyStoreEntity sarKeyStore = keyStoreRepository.findByUserId(sarId);
            PrivateKey sarPrivateKey = KeyUtil.decryptPrivateKey(sarKeyStore.getPrivateKey());

            VenueBooking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            //Verify that the club’s signature is valid before SAR signs
            KeyStoreEntity clubKeyStore = keyStoreRepository.findByUserId(booking.getClub().getId());
            if (clubKeyStore == null) {
                throw new RuntimeException("Club public key not found in keystore");
            }

            PublicKey clubPublicKey = KeyUtil.decodePublicKey(
                    Base64.getDecoder().decode(clubKeyStore.getPublicKey())
            );

            Signature clubSigVerifier = Signature.getInstance("SHA256withRSA");
            clubSigVerifier.initVerify(clubPublicKey);
            clubSigVerifier.update(booking.getBookingData().getBytes());

            boolean isValid = clubSigVerifier.verify(Base64.getDecoder().decode(booking.getClubSignature()));

            if (!isValid) {
                throw new RuntimeException("Club signature verification failed: Signature does not match the club");
            }

            //SAR signs booking + club signature
            String dataToSign = booking.getBookingData() + booking.getClubSignature();
            Signature sarSigner = Signature.getInstance("SHA256withRSA");
            sarSigner.initSign(sarPrivateKey);
            sarSigner.update(dataToSign.getBytes());
            String sarSignature = Base64.getEncoder().encodeToString(sarSigner.sign());

            booking.setSar(sar);
            booking.setSarSignature(sarSignature);

            //Handle SAR signature image
            if (sarSignatureImg != null && !sarSignatureImg.trim().isEmpty()) {
                try {
                    booking.setSarSignatureImage(Base64.getDecoder().decode(sarSignatureImg));
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid Base64 format for SAR signature image", e);
                }
            } else {
                booking.setSarSignatureImage(null);
            }

            booking.setStatus(BookingStatus.SAR_SIGNED);

            VenueBooking savedBooking = bookingRepository.save(booking);

            return bookingMapper.toDto(savedBooking);

        } catch (Exception e) {
            throw new RuntimeException("Failed to approve booking", e);
        }
    }


    @Override
    public VenueBookingResponseDto getBookingById(Long bookingId) {
        VenueBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return bookingMapper.toDto(booking);
    }

    @Override
    public List<VenueBookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toDto)
                .toList();
    }

    @Override
    public VenueBookingResponseDto finalApproveBooking(Long finalSignerId, Long bookingId, String finalSignatureImg) {
        try {
            User finalSigner = userRepository.findById(finalSignerId)
                    .orElseThrow(() -> new RuntimeException("Final Signer not found"));
            KeyStoreEntity finalKeyStore = keyStoreRepository.findByUserId(finalSignerId);
            PrivateKey finalPrivateKey = KeyUtil.decryptPrivateKey(finalKeyStore.getPrivateKey());

            VenueBooking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // 🔹 Verify that the SAR’s signature is valid before final signer signs
            if (booking.getSar() == null || booking.getSarSignature() == null) {
                throw new RuntimeException("SAR signature not found for this booking");
            }

            KeyStoreEntity sarKeyStore = keyStoreRepository.findByUserId(booking.getSar().getId());
            if (sarKeyStore == null) {
                throw new RuntimeException("SAR public key not found in keystore");
            }

            PublicKey sarPublicKey = KeyUtil.decodePublicKey(
                    Base64.getDecoder().decode(sarKeyStore.getPublicKey())
            );

            Signature sarSigVerifier = Signature.getInstance("SHA256withRSA");
            sarSigVerifier.initVerify(sarPublicKey);

            // SAR signed bookingData + clubSignature
            String sarSignedData = booking.getBookingData() + booking.getClubSignature();
            sarSigVerifier.update(sarSignedData.getBytes());

            boolean sarValid = sarSigVerifier.verify(Base64.getDecoder().decode(booking.getSarSignature()));
            if (!sarValid) {
                throw new RuntimeException("SAR signature verification failed: Signature does not match the SAR");
            }

            // 🔹 Final signer signs booking + club signature + SAR signature
            String dataToSign = booking.getBookingData() + booking.getClubSignature() + booking.getSarSignature();
            Signature finalSignerEngine = Signature.getInstance("SHA256withRSA");
            finalSignerEngine.initSign(finalPrivateKey);
            finalSignerEngine.update(dataToSign.getBytes());
            String finalSignature = Base64.getEncoder().encodeToString(finalSignerEngine.sign());

            booking.setFinalSigner(finalSigner);
            booking.setFinalSignature(finalSignature);

            if (finalSignatureImg != null && !finalSignatureImg.trim().isEmpty()) {
                try {
                    booking.setFinalSignatureImage(Base64.getDecoder().decode(finalSignatureImg));
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid Base64 format for Final signature image", e);
                }
            } else {
                booking.setFinalSignatureImage(null);
            }

            booking.setStatus(BookingStatus.APPROVED);

            VenueBooking savedBooking = bookingRepository.save(booking);

            return bookingMapper.toDto(savedBooking);

        } catch (Exception e) {
            throw new RuntimeException("Failed to final approve booking", e);
        }
    }

    @Override
    public long countPendingBookings() {
        return bookingRepository.countByStatus(BookingStatus.PENDING);
    }

    @Override
    public List<VenueBookingResponseDto> getBookingsByClubId(Long clubId) {
        List<VenueBooking> bookings = bookingRepository.findByClubId(clubId);
        return bookings.stream()
    public List<VenueBookingResponseDto> getFullyApprovedBookings() {
        return bookingRepository.findByStatus(BookingStatus.APPROVED)
                .stream()
                .map(bookingMapper::toDto)
                .toList();
    }

    @Override
    public List<VenueBookingSummaryDto> getAllBookingsSummary() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @Override
    public List<VenueBookingSummaryDto> getBookingsSummaryByClubId(Long clubId) {
        return bookingRepository.findByClubId(clubId)
                .stream()
                .map(this::toSummaryDto)
                .toList();
    }

    // Helper method to convert to summary DTO
    private VenueBookingSummaryDto toSummaryDto(VenueBooking booking) {
        VenueBookingSummaryDto dto = new VenueBookingSummaryDto();
        dto.setBookingId(booking.getId());
        dto.setClubName(booking.getClubName());
        dto.setRegistrationNumber(booking.getRegistrationNumber());
        dto.setContactNumber(booking.getContactNumber());
        dto.setDate(booking.getDate());
        dto.setReason(booking.getReason());
        dto.setStatus(booking.getStatus().name());
        dto.setVenueId(booking.getVenue().getId());
        dto.setVenueName(booking.getVenue().getName());

        dto.setSlotIds(booking.getSlots().stream().map(slot -> {
            VenueBookingSummaryDto.SlotDto s = new VenueBookingSummaryDto.SlotDto();
            s.setId(slot.getId());
            s.setStartTime(slot.getStartTime().toString());
            s.setEndTime(slot.getEndTime().toString());
            return s;
        }).toList());

        return dto;
    }

    @Override
    public List<VenueBookingSummaryDto> getBookingsSummaryByVenueId(Long venueId) {
        return bookingRepository.findByVenueId(venueId)
                .stream()
                .map(this::toSummaryDto)
                .toList();
    }


    @Override
    public Page<VenueBookingResponseDto> getAllBookingsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<VenueBooking> bookingPage = bookingRepository.findAll(pageable);

        return bookingPage.map(bookingMapper::toDto);
    }

    @Override
    public Page<VenueBookingResponseDto> getBookingsByStatus(BookingStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<VenueBooking> bookingPage = bookingRepository.findByStatus(status, pageable);
        return bookingPage.map(bookingMapper::toDto);
    }


    public DashboardStatsDto getDashboardStats() {
        long totalBookings = bookingRepository.count();
        long fullyApprovedBookings = bookingRepository.countByStatus(BookingStatus.APPROVED);
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long sarSignedBookings = bookingRepository.countByStatus(BookingStatus.SAR_SIGNED);

        // Count total users (you can adjust this based on your business logic)
        long totalClubs = 0;
        long totalStudentProfiles = 0;

        try {
            // Get total user counts - you can filter by role if you have role-based logic
            long totalUsers = userRepository.count();
            totalClubs = totalUsers; // Adjust this logic based on your requirements
            totalStudentProfiles = totalUsers;
        } catch (Exception e) {
            // Fallback in case of any issues
            totalClubs = 0;
            totalStudentProfiles = 0;
        }

        return DashboardStatsDto.builder()
                .totalClubs(totalClubs)
                .totalStudentProfiles(totalStudentProfiles)
                .totalBookings(totalBookings)
                .fullyApprovedBookings(fullyApprovedBookings)
                .pendingBookings(pendingBookings)
                .rejectedBookings(0) // You can add logic for rejected bookings if you have that status
                .build();
    }

}