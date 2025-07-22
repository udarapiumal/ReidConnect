package reidConnect.backend.mapper;

import org.springframework.stereotype.Component;
import reidConnect.backend.dto.staff.StaffRequestDto;
import reidConnect.backend.dto.staff.StaffResponseDto;
import reidConnect.backend.entity.Staff;

@Component
public class StaffMapper {

    public Staff toEntity(StaffRequestDto dto) {
        Staff staff = new Staff();
        staff.setName(dto.getName());
        staff.setCode(dto.getCode());
        staff.setFaculty(dto.getFaculty());
        staff.setRank(dto.getRank());
        staff.setEmail(dto.getEmail());
        staff.setDegree(dto.getDegree());
        return staff;
    }

    public StaffResponseDto toDto(Staff staff) {
        StaffResponseDto dto = new StaffResponseDto();
        dto.setId(staff.getId());
        dto.setName(staff.getName());
        dto.setCode(staff.getCode());
        dto.setFaculty(staff.getFaculty());
        dto.setRank(staff.getRank());
        dto.setEmail(staff.getEmail());
        dto.setDegree(staff.getDegree());
        return dto;
    }
}
