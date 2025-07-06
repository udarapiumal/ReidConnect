package reidConnect.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import reidConnect.backend.dto.ClubDto;
import reidConnect.backend.service.ClubService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/club")
public class ClubController {

    private ClubService clubService;

    //Build Add Club REST API
    @PreAuthorize("hasRole('CLUB')")
    @PostMapping
    public ResponseEntity<ClubDto> createClub(@RequestBody ClubDto clubDto) {
        ClubDto savedClub = clubService.createClub(clubDto);
        return new ResponseEntity<>(savedClub, HttpStatus.CREATED);
    }

    //Build Get Club REST API
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping("{id}")
    public ResponseEntity<ClubDto> getClubById(@PathVariable("id") Long clubId) {
        ClubDto clubDto = clubService.getClubById(clubId);
        return ResponseEntity.ok(clubDto);
    }

    //Build Get Club by user_id REST API
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<ClubDto> getClubByUserId(@PathVariable("userId") Long userId) {
        ClubDto clubDto = clubService.getByUserId(userId);
        return ResponseEntity.ok(clubDto);
    }


    //Build Get All Clubs REST API
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping
    public ResponseEntity<Iterable<ClubDto>> getAllClubs() {
        List<ClubDto> clubs = clubService.getAllClubs();
        return ResponseEntity.ok(clubs);
    }

    //Build Update Club REST API
    @PreAuthorize("hasRole('CLUB')")
    @PutMapping("{id}")
    public ResponseEntity<ClubDto> updateClub(@PathVariable("id") Long clubId,
                                              @RequestBody ClubDto updatedClub) {
        ClubDto clubDto = clubService.updateClub(clubId, updatedClub);
        return ResponseEntity.ok(clubDto);
    }

    //Build Delete Club REST API
    @PreAuthorize("hasRole('CLUB')")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteClubById(@PathVariable("id") Long clubId) {
        clubService.deleteClubById(clubId);
        return ResponseEntity.ok("Club deleted successfully");
    }
}
