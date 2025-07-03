package reidConnect.backend.mapper;

import reidConnect.backend.dto.ClubCoordinatorDto;
import reidConnect.backend.entity.ClubCoordinator;
import reidConnect.backend.entity.User;

public class ClubCoordinatorMapper {

    public static ClubCoordinatorDto mapToClubCoordinatorDto(ClubCoordinator clubCoordinator) {
        return new ClubCoordinatorDto(
                clubCoordinator.getId(),
                clubCoordinator.getClub_name(),
                clubCoordinator.getUser().getId(),
                clubCoordinator.getWebsite(),
                clubCoordinator.getProfile_picture(),
                clubCoordinator.getBio(),
                clubCoordinator.getSub_count()
        );
    }

    public static ClubCoordinator mapToClubCoordinator(ClubCoordinatorDto clubCoordinatorDto, User user) {
        return new ClubCoordinator(
                clubCoordinatorDto.getId(),
                clubCoordinatorDto.getClubName(),
                clubCoordinatorDto.getWebsite(),
                clubCoordinatorDto.getProfilePicture(),
                clubCoordinatorDto.getSubCount(),
                clubCoordinatorDto.getBio(),
                user
        );
    }
}
