package reidConnect.backend.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.ClubCoordinatorDto;
import reidConnect.backend.entity.ClubCoordinator;
import reidConnect.backend.entity.User;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.ClubCoordinatorMapper;
import reidConnect.backend.repository.ClubCoordinatorRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.ClubCoordinatorService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ClubCoordinatorServiceImpl implements ClubCoordinatorService {

    private final ClubCoordinatorRepository clubCoordinatorRepository;
    private final UserRepository userRepository;

    @Override
    public ClubCoordinatorDto createClubCoordinator(ClubCoordinatorDto clubCoordinatorDto) {
        //Fetch User entity from userId
        User user = userRepository.findById(clubCoordinatorDto.getUser_id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for id: " + clubCoordinatorDto.getUser_id()));

        //Pass User entity into mapper
        ClubCoordinator clubCoordinator = ClubCoordinatorMapper.mapToClubCoordinator(clubCoordinatorDto, user);
        ClubCoordinator savedClubCoordinator = clubCoordinatorRepository.save(clubCoordinator);
        return ClubCoordinatorMapper.mapToClubCoordinatorDto(savedClubCoordinator);
    }

    @Override
    public ClubCoordinatorDto getClubCoordinatorById(Long clubCoordinatorId) {
        ClubCoordinator clubCoordinator = clubCoordinatorRepository.findById(clubCoordinatorId)
                .orElseThrow(() -> new ResourceNotFoundException("ClubCoordinator not found for this id :: " + clubCoordinatorId));

        return ClubCoordinatorMapper.mapToClubCoordinatorDto(clubCoordinator);
    }

    @Override
    public List<ClubCoordinatorDto> getAllClubCoordinators() {
        List<ClubCoordinator> clubCoordinators = clubCoordinatorRepository.findAll();
        return clubCoordinators.stream()
                .map(ClubCoordinatorMapper::mapToClubCoordinatorDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClubCoordinatorDto updateClubCoordinator(Long clubCoordinatorId, ClubCoordinatorDto updatedClubCoordinatorDto) {
        ClubCoordinator clubCoordinator = clubCoordinatorRepository.findById(clubCoordinatorId)
                .orElseThrow(() -> new ResourceNotFoundException("ClubCoordinator not found for this id :: " + clubCoordinatorId));

        // Update the fields (assuming these exist — adjust if not)
        clubCoordinator.setClub_name(updatedClubCoordinatorDto.getClubName());
        clubCoordinator.setWebsite(updatedClubCoordinatorDto.getWebsite());
        clubCoordinator.setProfile_picture(updatedClubCoordinatorDto.getProfilePicture());
        clubCoordinator.setBio(updatedClubCoordinatorDto.getBio());
        clubCoordinator.setSub_count(updatedClubCoordinatorDto.getSub_count());

        // Update user if changed (optional)
        if (!clubCoordinator.getUser().getId().equals(updatedClubCoordinatorDto.getUser_id())) {
            User user = userRepository.findById(updatedClubCoordinatorDto.getUser_id())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found for id: " + updatedClubCoordinatorDto.getUser_id()));
            clubCoordinator.setUser(user);
        }

        ClubCoordinator updated = clubCoordinatorRepository.save(clubCoordinator);
        return ClubCoordinatorMapper.mapToClubCoordinatorDto(updated);
    }

    @Override
    public void deleteClubCoordinatorById(Long clubCoordinatorId) {
        ClubCoordinator clubCoordinator = clubCoordinatorRepository.findById(clubCoordinatorId)
                .orElseThrow(() -> new ResourceNotFoundException("ClubCoordinator not found for this id :: " + clubCoordinatorId));
        clubCoordinatorRepository.delete(clubCoordinator);
    }
}
