package reidConnect.backend.service;
import reidConnect.backend.dto.ClubDto;
import java.util.List;

public interface ClubService {
    ClubDto createClub(ClubDto clubDto);

    ClubDto getClubById(Long clubCoordinatorId);

    ClubDto getByUserId(Long userId);

    List<ClubDto> getAllClubs();

    ClubDto updateClub(Long clubCoordinatorId, ClubDto updatedClubCoordinator);

    void deleteClubById(Long clubCoordinatorId);

}
