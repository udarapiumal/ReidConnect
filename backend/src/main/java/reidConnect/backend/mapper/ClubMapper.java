package reidConnect.backend.mapper;

import reidConnect.backend.dto.ClubDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.User;

public class ClubMapper {

    public static ClubDto mapToClubDto(Club club) {
        ClubDto dto = new ClubDto();
        dto.setId(club.getId());
        dto.setClubName(club.getClub_name());
        dto.setWebsite(club.getWebsite());
        dto.setProfilePicture(club.getProfile_picture());
        dto.setCoverPicture(club.getCover_picture());
        dto.setBio(club.getBio());
        User user = club.getUser();
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUserEnabled(user.isEnabled());
            dto.setEmail(user.getEmail());
            dto.setUsername(user.getName());
        }
        return dto;
    }

    public static Club mapToClub(ClubDto clubDto, User user) {
        return new Club(
                clubDto.getId(),
                clubDto.getClubName(),
                clubDto.getWebsite(),
                clubDto.getProfilePicture(),
                clubDto.getCoverPicture(),
                clubDto.getBio(),
                user);
    }
}
