package net.reidConnect.rc.mapper;

import net.reidConnect.rc.dto.ClubCoordinatorDto;
import net.reidConnect.rc.entity.ClubCoordinator;

public class ClubCoordinatorMapper {

    public static ClubCoordinatorDto mapToClubCoordinatorDto(ClubCoordinator clubCoordinator) {
        return new ClubCoordinatorDto(
                clubCoordinator.getId(),
                clubCoordinator.getUserName(),
                clubCoordinator.getRegistrationNumber(),
                clubCoordinator.getIndexNumber(),
                clubCoordinator.getEmail()
        );
    }

    public static ClubCoordinator mapToClubCoordinator(ClubCoordinatorDto clubCoordinatorDto) {
        return new ClubCoordinator(
                clubCoordinatorDto.getId(),
                clubCoordinatorDto.getUserName(),
                clubCoordinatorDto.getRegistrationNumber(),
                clubCoordinatorDto.getIndexNumber(),
                clubCoordinatorDto.getEmail()
        );
    }
}
