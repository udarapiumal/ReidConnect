package reidConnect.backend.service;

import reidConnect.backend.dto.staff.OccupiedStaffDto;

import java.util.List;

public interface OccupiedStaffService {
    void addOccupiedStaff(List<OccupiedStaffDto> dtos);

    boolean hasStaffClash(Long staffId, String day, List<Long> slotIds, Long academicCalendarId);
}
