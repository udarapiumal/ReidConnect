package reidConnect.backend.mapper;

import reidConnect.backend.dto.ClubDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.User;

public class ClubMapper {

    public static ClubDto mapToClubDto(Club club) {
        return new ClubDto(
                club.getId(),
                club.getClub_name(),
                club.getUser().getId(),
                club.getWebsite(),
                club.getProfile_picture(),
                club.getCover_picture(),
                club.getBio()
        );
    }

    public static Club mapToClub(ClubDto clubDto, User user) {
        return new Club(
                clubDto.getId(),
                clubDto.getClubName(),
                clubDto.getWebsite(),
                clubDto.getProfilePicture(),
                clubDto.getCoverPicture(),
                clubDto.getBio(),
                user
        );
    }
}
