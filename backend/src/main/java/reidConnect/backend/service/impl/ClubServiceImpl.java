package reidConnect.backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.ClubDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.User;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.ClubMapper;
import reidConnect.backend.repository.ClubRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.ClubService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    @Override
    public ClubDto createClub(ClubDto clubDto) {
        //Fetch User entity from userId
        User user = userRepository.findById(clubDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for id: " + clubDto.getUserId()));

        //Pass User entity into mapper
        Club club = ClubMapper.mapToClub(clubDto, user);
        Club savedClub = clubRepository.save(club);
        return ClubMapper.mapToClubDto(savedClub);
    }

    @Override
    public ClubDto getClubById(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found for this id :: " + clubId));

        return ClubMapper.mapToClubDto(club);
    }

    @Override
    public ClubDto getByUserId(Long userId) {
        Club club = clubRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Club Coordinator not found for user ID: " + userId));
        return ClubMapper.mapToClubDto(club);
    }

    @Override
    public List<ClubDto> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream()
                .map(ClubMapper::mapToClubDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClubDto updateClub(Long clubId, ClubDto updatedClubDto) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found for this id :: " + clubId));

        // Update the fields (assuming these exist — adjust if not)
        club.setClub_name(updatedClubDto.getClubName());
        club.setWebsite(updatedClubDto.getWebsite());
        club.setProfile_picture(updatedClubDto.getProfilePicture());
        club.setBio(updatedClubDto.getBio());

        // Update the user if changed (optional)
        if (!club.getUser().getId().equals(updatedClubDto.getUserId())) {
            User user = userRepository.findById(updatedClubDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found for id: " + updatedClubDto.getUserId()));
            club.setUser(user);
        }

        Club updated = clubRepository.save(club);
        return ClubMapper.mapToClubDto(updated);
    }

    @Override
    public void deleteClubById(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found for this id :: " + clubId));
        clubRepository.delete(club);
    }
}
