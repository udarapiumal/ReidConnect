package reidConnect.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import reidConnect.backend.dto.ClubCoordinatorDto;
import reidConnect.backend.service.ClubCoordinatorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/club-coordinators")
public class ClubCoordinatorController {

    private ClubCoordinatorService clubCoordinatorService;

    //Build Add ClubCoordinator REST API
    @PreAuthorize("hasRole('CLUB')")
    @PostMapping
    public ResponseEntity<ClubCoordinatorDto> createClubCoordinator(@RequestBody ClubCoordinatorDto clubCoordinatorDto) {
        ClubCoordinatorDto savedClubCoordinator = clubCoordinatorService.createClubCoordinator(clubCoordinatorDto);
        return new ResponseEntity<>(savedClubCoordinator, HttpStatus.CREATED);
    }

    //Build Get ClubCoordinator REST API
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping("{id}")
    public ResponseEntity<ClubCoordinatorDto> getClubCoordinatorById(@PathVariable("id") Long clubCoordinatorId) {
        ClubCoordinatorDto clubCoordinatorDto = clubCoordinatorService.getClubCoordinatorById(clubCoordinatorId);
        return ResponseEntity.ok(clubCoordinatorDto);
    }

    //Build Get ClubCoordinator by user_id REST API
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<ClubCoordinatorDto> getClubCoordinatorByUserId(@PathVariable("userId") Long userId) {
        ClubCoordinatorDto clubCoordinatorDto = clubCoordinatorService.getByUserId(userId);
        return ResponseEntity.ok(clubCoordinatorDto);
    }


    //Build Get All ClubCoordinators REST API
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping
    public ResponseEntity<Iterable<ClubCoordinatorDto>> getAllClubCoordinators() {
        List<ClubCoordinatorDto> clubCoordinators = clubCoordinatorService.getAllClubCoordinators();
        return ResponseEntity.ok(clubCoordinators);
    }

    //Build Update ClubCoordinator REST API
    @PreAuthorize("hasRole('CLUB')")
    @PutMapping("{id}")
    public ResponseEntity<ClubCoordinatorDto> updateClubCoordinator(@PathVariable("id") Long clubCoordinatorId,
                                                                    @RequestBody ClubCoordinatorDto updatedClubCoordinator) {
        ClubCoordinatorDto clubCoordinatorDto = clubCoordinatorService.updateClubCoordinator(clubCoordinatorId, updatedClubCoordinator);
        return ResponseEntity.ok(clubCoordinatorDto);
    }

    //Build Delete ClubCoordinator REST API
    @PreAuthorize("hasRole('CLUB')")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteClubCoordinatorById(@PathVariable("id") Long clubCoordinatorId) {
        clubCoordinatorService.deleteClubCoordinatorById(clubCoordinatorId);
        return ResponseEntity.ok("ClubCoordinator deleted successfully");
    }
}
