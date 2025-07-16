package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reidConnect.backend.dto.EventRequestDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.EventUpdateDto;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;
import reidConnect.backend.service.EventService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // CREATE EVENT
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> createEvent(
            @RequestParam("clubId") Long clubId,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "venueId", required = false) Long venueId,
            @RequestParam(value = "venueName", required = false) String venueName,
            @RequestParam("date") String date,
            @RequestParam("slotIds") List<Long> slotIds,
            @RequestParam("targetYears") List<Years> targetYears,
            @RequestParam("targetFaculties") List<Faculties> targetFaculties,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            System.out.println("📥 Received POST request to /api/events");
            System.out.println("📝 Club ID: " + clubId);
            System.out.println("📝 Event Name: " + name);
            System.out.println("📁 Slot IDs count: " + (slotIds != null ? slotIds.size() : 0));
            System.out.println("🖼️ Image File: " + imageFile.getOriginalFilename());

            if (!eventService.doAllSlotsExist(slotIds)) {
                return ResponseEntity.badRequest().body("❌ One or more slot IDs are invalid.");
            }

            if (imageFile == null || imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("❌ Image is required.");
            }

            // ✅ Save the image file to /static/uploads
            String savedFilePath = null;
            Path uploadDir = Paths.get("src/main/resources/static/uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                System.out.println("📁 Created upload directory: " + uploadDir);
            }

            String originalFilename = imageFile.getOriginalFilename();
            if (originalFilename != null && !originalFilename.isBlank()) {
                String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;
                Path filePath = uploadDir.resolve(uniqueFileName);
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                savedFilePath = "uploads/" + uniqueFileName;
                System.out.println("💾 Saved event image: " + savedFilePath);
            } else {
                return ResponseEntity.badRequest().body("❌ Image filename is invalid.");
            }

            // ✅ Build DTO and pass to service
            EventRequestDto dto = new EventRequestDto(
                    clubId,
                    name,
                    description,
                    venueId,
                    venueName,
                    LocalDate.parse(date),
                    savedFilePath,
                    slotIds,
                    targetYears,
                    targetFaculties
            );

            EventResponseDto createdEvent = eventService.createEvent(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);

        } catch (Exception e) {
            System.err.println("❌ Error creating event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error creating event: " + e.getMessage());
        }
    }


    // UPDATE EVENT
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "venueId", required = false) Long venueId,
            @RequestParam(value = "venueName", required = false) String venueName,
            @RequestParam("date") String date,
            @RequestParam("slotIds") List<Long> slotIds,
            @RequestParam("targetYears") List<Years> targetYears,
            @RequestParam("targetFaculties") List<Faculties> targetFaculties,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            if (!eventService.doAllSlotsExist(slotIds)) {
                return ResponseEntity.badRequest().body("❌ One or more slot IDs are invalid.");
            }

            String savedFilePath = null;

            if (imageFile != null && !imageFile.isEmpty()) {
                Path uploadDir = Paths.get("src/main/resources/static/uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                String originalFilename = imageFile.getOriginalFilename();
                if (originalFilename != null && !originalFilename.isBlank()) {
                    String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;
                    Path filePath = uploadDir.resolve(uniqueFileName);
                    Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    savedFilePath = "uploads/" + uniqueFileName;
                } else {
                    return ResponseEntity.badRequest().body("❌ Image filename is invalid.");
                }
            }

            EventUpdateDto dto = new EventUpdateDto(
                    name,
                    description,
                    venueId,
                    venueName,
                    LocalDate.parse(date),
                    savedFilePath,
                    slotIds,
                    targetYears,
                    targetFaculties

            );

            EventResponseDto updatedEvent = eventService.updateEvent(id, dto);
            return ResponseEntity.ok(updatedEvent);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error updating event: " + e.getMessage());
        }
    }


    // ✅ GET ALL EVENTS
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // ✅ GET EVENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // ✅ DELETE EVENT
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("✅ Event deleted successfully.");
    }

    // ✅ Helper method for image upload
    private String saveImage(MultipartFile image) throws Exception {
        Path uploadDir = Paths.get("src/main/resources/static/uploads");
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        String uniqueFileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path filePath = uploadDir.resolve(uniqueFileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "uploads/" + uniqueFileName;
    }

    @GetMapping("/conflicts")
    public ResponseEntity<List<EventResponseDto>> getEventsByFacultyAndYear(
            @RequestParam List<Faculties> faculties,
            @RequestParam List<Years> years
    ) {
        List<EventResponseDto> events = eventService.getEventsByFacultiesAndYears(faculties, years);
        return ResponseEntity.ok(events);
    }

}
