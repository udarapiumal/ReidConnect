package reidConnect.backend.service;

import reidConnect.backend.dto.staff.StaffRequestDto;
import reidConnect.backend.dto.staff.StaffResponseDto;

import java.util.List;

public interface StaffService {
    StaffResponseDto createStaff(StaffRequestDto dto);
    StaffResponseDto updateStaff(Long id, StaffRequestDto dto);
    void deleteStaff(Long id);
    StaffResponseDto getStaffById(Long id);
    List<StaffResponseDto> getAllStaff();
}
