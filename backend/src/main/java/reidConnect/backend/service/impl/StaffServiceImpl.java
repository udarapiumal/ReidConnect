package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.staff.StaffRequestDto;
import reidConnect.backend.dto.staff.StaffResponseDto;
import reidConnect.backend.entity.Staff;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.StaffMapper;
import reidConnect.backend.repository.StaffRepository;
import reidConnect.backend.service.StaffService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;

    @Override
    public StaffResponseDto createStaff(StaffRequestDto dto) {
        Staff staff = staffMapper.toEntity(dto);
        return staffMapper.toDto(staffRepository.save(staff));
    }

    @Override
    public StaffResponseDto updateStaff(Long id, StaffRequestDto dto) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));

        staff.setName(dto.getName());
        staff.setCode(dto.getCode());
        staff.setFaculty(dto.getFaculty());
        staff.setRank(dto.getRank());
        staff.setEmail(dto.getEmail());
        staff.setDegree(dto.getDegree());

        return staffMapper.toDto(staffRepository.save(staff));
    }

    @Override
    public void deleteStaff(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        staffRepository.delete(staff);
    }

    @Override
    public StaffResponseDto getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        return staffMapper.toDto(staff);
    }

    @Override
    public List<StaffResponseDto> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(staffMapper::toDto)
                .collect(Collectors.toList());
    }
}
