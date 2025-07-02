package reidConnect.backend.service;

import reidConnect.backend.dto.ClubCoordinatorDto;

import java.util.List;

public interface ClubCoordinatorService {
    ClubCoordinatorDto createClubCoordinator(ClubCoordinatorDto clubCoordinatorDto);

    ClubCoordinatorDto getClubCoordinatorById(Long clubCoordinatorId);

    List<ClubCoordinatorDto> getAllClubCoordinators();

    ClubCoordinatorDto updateClubCoordinator(Long clubCoordinatorId, ClubCoordinatorDto updatedClubCoordinator);

    void deleteClubCoordinatorById(Long clubCoordinatorId);

}
