package reidConnect.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.staff.OccupiedStaffDto;
import reidConnect.backend.entity.OccupiedStaff;
import reidConnect.backend.entity.Slot;
import reidConnect.backend.entity.TimeTable;
import reidConnect.backend.entity.Staff;
import reidConnect.backend.exception.StaffClashException;
import reidConnect.backend.repository.OccupiedStaffRepository;
import reidConnect.backend.repository.SlotRepository;
import reidConnect.backend.repository.TimeTableRepository;
import reidConnect.backend.repository.StaffRepository;
import reidConnect.backend.service.OccupiedStaffService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OccupiedStaffServiceImpl implements OccupiedStaffService {

    private final OccupiedStaffRepository occupiedStaffRepository;
    private final StaffRepository staffRepository;
    private final SlotRepository slotRepository;
    private final TimeTableRepository timeTableRepository;

    @Override
    public boolean hasStaffClash(Long staffId, String day, List<Long> slotIds) {
        return !occupiedStaffRepository.findByStaff_IdAndDayAndSlot_IdIn(staffId, day, slotIds).isEmpty();
    }

    @Override
    @Transactional
    public void addOccupiedStaff(List<OccupiedStaffDto> dtos) {
        for (OccupiedStaffDto dto : dtos) {
            Staff staff = staffRepository.findById(dto.getStaffId())
                    .orElseThrow(() -> new RuntimeException("Staff Member not found"));
            Slot slot = slotRepository.findById(dto.getSlotId())
                    .orElseThrow(() -> new RuntimeException("Slot not found"));
            TimeTable timeTable = timeTableRepository.findById(dto.getTimeTableId())
                    .orElseThrow(() -> new RuntimeException("TimeTable not found"));

            // Check if this venue/slot/day is already occupied
            OccupiedStaff existing = occupiedStaffRepository
                    .findByStaffIdAndDayAndSlotId(staff.getId(), dto.getDay(), slot.getId())
                    .orElse(null);

            if (existing != null) {
                String existingCourseName = existing.getTimeTable().getCourse().getName();
                throw new StaffClashException(
                        String.format("Staff clash detected: The staff member '%s' is already occupied by '%s' on %s from %s to %s. " +
                                        "Please choose a different course or time slot to avoid scheduling conflicts.",
                                staff.getName(),
                                existingCourseName,
                                (dto.getDay()),
                                (slot.getStartTime()),
                                (slot.getEndTime())
                        )
                );
            }

            // If no clash, save
            OccupiedStaff os = new OccupiedStaff();
            os.setStaff(staff);
            os.setDay(dto.getDay());
            os.setSlot(slot);
            os.setTimeTable(timeTable);

            occupiedStaffRepository.save(os);
        }
    }

}
