package reidConnect.backend.service.impl;

import lombok.AllArgsConstructor;
import reidConnect.backend.dto.ClubCoordinatorDto;
import reidConnect.backend.entity.ClubCoordinator;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.ClubCoordinatorMapper;
import reidConnect.backend.repository.ClubCoordinatorRepository;
import reidConnect.backend.service.ClubCoordinatorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ClubCoordinatorServiceImpl implements ClubCoordinatorService{

    private ClubCoordinatorRepository clubCoordinatorRepository;

    @Override
    public ClubCoordinatorDto createClubCoordinator(ClubCoordinatorDto clubCoordinatorDto) {

        ClubCoordinator clubCoordinator = ClubCoordinatorMapper.mapToClubCoordinator(clubCoordinatorDto);
        ClubCoordinator savedClubCoordinator =  clubCoordinatorRepository.save(clubCoordinator);
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
        return clubCoordinators.stream().map((clubCoordinator) -> ClubCoordinatorMapper.mapToClubCoordinatorDto(clubCoordinator))
                .collect(Collectors.toList());
    }

    @Override
    public ClubCoordinatorDto updateClubCoordinator(Long clubCoordinatorId, ClubCoordinatorDto updatedClubCoordinator) {

        ClubCoordinator clubCoordinator = clubCoordinatorRepository.findById(clubCoordinatorId).orElseThrow(
                () -> new ResourceNotFoundException("ClubCoordinator not found for this id :: " + clubCoordinatorId)
        );

        clubCoordinator.setUserName(updatedClubCoordinator.getUserName());
        clubCoordinator.setRegistrationNumber(updatedClubCoordinator.getRegistrationNumber());
        clubCoordinator.setIndexNumber(updatedClubCoordinator.getIndexNumber());
        clubCoordinator.setEmail(updatedClubCoordinator.getEmail());

        ClubCoordinator updatedClubCoordinatorObj =  clubCoordinatorRepository.save(clubCoordinator);

        return ClubCoordinatorMapper.mapToClubCoordinatorDto(updatedClubCoordinatorObj);
    }

    @Override
    public void deleteClubCoordinatorById(Long clubCoordinatorId) {

        ClubCoordinator clubCoordinator = clubCoordinatorRepository.findById(clubCoordinatorId).orElseThrow(
                () -> new ResourceNotFoundException("ClubCoordinator not found for this id :: " + clubCoordinatorId)
        );
        clubCoordinatorRepository.deleteById(clubCoordinatorId);

    }
}
