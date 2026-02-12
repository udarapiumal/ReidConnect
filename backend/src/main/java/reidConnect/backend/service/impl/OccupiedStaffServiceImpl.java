package reidConnect.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.staff.OccupiedStaffDto;
import reidConnect.backend.entity.AcademicCalendar;
import reidConnect.backend.entity.OccupiedStaff;
import reidConnect.backend.entity.Slot;
import reidConnect.backend.entity.TimeTable;
import reidConnect.backend.entity.Staff;
import reidConnect.backend.exception.StaffClashException;
import reidConnect.backend.repository.AcademicCalendarRepository;
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
        private final AcademicCalendarRepository academicCalendarRepository;

        @Override
        public boolean hasStaffClash(Long staffId, String day, List<Long> slotIds, Long academicCalendarId) {
                return !occupiedStaffRepository.findByStaff_IdAndDayAndSlot_IdInAndAcademicCalendar_Id(staffId, day,
                                slotIds, academicCalendarId).isEmpty();
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
                        AcademicCalendar academicCalendar = academicCalendarRepository
                                        .findById(dto.getAcademicCalendarId())
                                        .orElseThrow(() -> new RuntimeException("Academic Calendar not found"));

                        // Check if this staff/slot/day is already occupied for this academic calendar
                        OccupiedStaff existing = occupiedStaffRepository
                                        .findByStaffIdAndDayAndSlotIdAndAcademicCalendar_Id(staff.getId(), dto.getDay(),
                                                        slot.getId(), academicCalendar.getId())
                                        .orElse(null);

                        if (existing != null) {
                                String existingCourseName = existing.getTimeTable().getCourse().getName();
                                throw new StaffClashException(
                                                String.format("Staff clash detected: The staff member '%s' is already occupied by '%s' on %s from %s to %s. "
                                                                +
                                                                "Please choose a different course or time slot to avoid scheduling conflicts.",
                                                                staff.getName(),
                                                                existingCourseName,
                                                                (dto.getDay()),
                                                                (slot.getStartTime()),
                                                                (slot.getEndTime())));
                        }

                        // If no clash, save
                        OccupiedStaff os = new OccupiedStaff();
                        os.setStaff(staff);
                        os.setDay(dto.getDay());
                        os.setSlot(slot);
                        os.setTimeTable(timeTable);
                        os.setAcademicCalendar(academicCalendar);

                        occupiedStaffRepository.save(os);
                }
        }

}
