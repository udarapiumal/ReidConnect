package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.VenueBookingStatus;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.VenueBookingService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueBookingServiceImpl implements VenueBookingService {

    private final VenueBookingRepository venueBookingRepository;
    private final ClubRepository clubRepository;
    private final VenueRepository venueRepository;
    private final SlotRepository slotRepository;
    private final VenueBookingSlotRepository venueBookingSlotRepository;

    @Override
    public void createVenueBooking(VenueBookingRequestDto dto) {
        Club club = clubRepository.findById(dto.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Venue venue = venueRepository.findById(dto.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        VenueBooking booking = new VenueBooking();
        booking.setClub(club);
        booking.setVenue(venue);
        booking.setRequestedDate(dto.getRequestedDate());
        booking.setReason(dto.getReason());
        booking.setApplicantName(dto.getApplicantName());
        booking.setRegistrationNumber(dto.getRegistrationNumber());
        booking.setContactNumber(dto.getContactNumber());
        booking.setFormSignedDate(LocalDateTime.now());
        booking.setStatus(VenueBookingStatus.PENDING);

        venueBookingRepository.save(booking);

        List<Slot> slots = slotRepository.findAllById(dto.getSlotIds());

        for (Slot slot : slots) {
            VenueBookingSlot vbs = new VenueBookingSlot();
            vbs.setVenueBooking(booking);
            vbs.setSlot(slot);
            venueBookingSlotRepository.save(vbs);
        }
    }

    @Override
    public List<VenueBookingResponseDto> getAllBookings() {
        return venueBookingRepository.findAll().stream().map(booking -> {
            VenueBookingResponseDto dto = new VenueBookingResponseDto();
            dto.setId(booking.getId());
            dto.setClubName(booking.getClub().getClub_name());
            dto.setVenueName(booking.getVenue().getName());
            dto.setRequestedDate(booking.getRequestedDate());
            dto.setReason(booking.getReason());
            dto.setApplicantName(booking.getApplicantName());
            dto.setRegistrationNumber(booking.getRegistrationNumber());
            dto.setContactNumber(booking.getContactNumber());
            dto.setStatus(booking.getStatus());
            dto.setSlotTimes(booking.getBookingSlots().stream()
                    .map(slot -> slot.getSlot().getStartTime() + " - " + slot.getSlot().getEndTime())
                    .collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }
}
