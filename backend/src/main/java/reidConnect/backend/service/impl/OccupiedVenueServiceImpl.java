package reidConnect.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.venue.OccupiedVenueDto;
import reidConnect.backend.entity.OccupiedVenue;
import reidConnect.backend.entity.Slot;
import reidConnect.backend.entity.TimeTable;
import reidConnect.backend.entity.Venue;
import reidConnect.backend.exception.VenueClashException;
import reidConnect.backend.repository.OccupiedVenueRepository;
import reidConnect.backend.repository.SlotRepository;
import reidConnect.backend.repository.TimeTableRepository;
import reidConnect.backend.repository.VenueRepository;
import reidConnect.backend.service.OccupiedVenueService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OccupiedVenueServiceImpl implements OccupiedVenueService {

    private final OccupiedVenueRepository occupiedVenueRepository;
    private final VenueRepository venueRepository;
    private final SlotRepository slotRepository;
    private final TimeTableRepository timeTableRepository;

    @Override
    public boolean hasVenueClash(Long venueId, String day, List<Long> slotIds) {
        return !occupiedVenueRepository.findByVenue_IdAndDayAndSlot_IdIn(venueId, day, slotIds).isEmpty();
    }

    @Override
    @Transactional
    public void addOccupiedVenues(List<OccupiedVenueDto> dtos) {
        for (OccupiedVenueDto dto : dtos) {
            Venue venue = venueRepository.findById(dto.getVenueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found"));
            Slot slot = slotRepository.findById(dto.getSlotId())
                    .orElseThrow(() -> new RuntimeException("Slot not found"));
            TimeTable timeTable = timeTableRepository.findById(dto.getTimeTableId())
                    .orElseThrow(() -> new RuntimeException("TimeTable not found"));

            // Check if this venue/slot/day is already occupied
            OccupiedVenue existing = occupiedVenueRepository
                    .findByVenueIdAndDayAndSlotId(venue.getId(), dto.getDay(), slot.getId())
                    .orElse(null);

            if (existing != null) {
                String existingCourseName = existing.getTimeTable().getCourse().getName();
                throw new VenueClashException(
                        String.format("Venue clash detected: The venue '%s' is already occupied by '%s' on %s from %s to %s. " +
                                        "Please choose a different venue or time slot to avoid scheduling conflicts.",
                                venue.getName(),
                                existingCourseName,
                                (dto.getDay()),
                                (slot.getStartTime()),
                                (slot.getEndTime())
                        )
                );
            }

            // If no clash, save
            OccupiedVenue ov = new OccupiedVenue();
            ov.setVenue(venue);
            ov.setDay(dto.getDay());
            ov.setSlot(slot);
            ov.setTimeTable(timeTable);

            occupiedVenueRepository.save(ov);
        }
    }

}
