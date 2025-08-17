// BookingController.java
package reidConnect.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.service.BookingService;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public VenueBookingResponseDto create(@RequestBody VenueBookingRequestDto req) throws Exception {
        return bookingService.createBookingAndEnvelope(req);
    }

    // Embedded signing URL for Club
    //@PreAuthorize("hasRole('CLUB')")
    @GetMapping("/{id}/sign/club")
    public String clubSigningUrl(@PathVariable Long id,
                                 @RequestParam String name,
                                 @RequestParam String email) throws Exception {
        return bookingService.getEmbeddedSigningUrlForClub(id, name, email);
    }

    // Embedded signing URL for SAR
    //@PreAuthorize("hasRole('ACADEMIC_SAR')")
    @GetMapping("/{id}/sign/sar")
    public String sarSigningUrl(@PathVariable Long id,
                                @RequestParam String name,
                                @RequestParam String email) throws Exception {
        return bookingService.getEmbeddedSigningUrlForSar(id, name, email);
    }

    // Embedded signing URL for Union
    //@PreAuthorize("hasRole('UNION')")
    @GetMapping("/{id}/sign/union")
    public String unionSigningUrl(@PathVariable Long id) throws Exception {
        // Fetch union user from DB
        return bookingService.getEmbeddedSigningUrlForUnion(id);
    }

    // Embedded signing URL for Academic Deputy Director
    //@PreAuthorize("hasRole('ACADEMIC_DEPUTY_DIRECTOR')")
    @GetMapping("/{id}/sign/deputy")
    public String deputySigningUrl(@PathVariable Long id) throws Exception {
        // Fetch deputy director user from DB
        return bookingService.getEmbeddedSigningUrlForDeputy(id);
    }


    // Download signed PDF
    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public byte[] download(@PathVariable Long id, HttpServletResponse resp) throws Exception {
        resp.setHeader("Content-Disposition", "attachment; filename=booking-" + id + ".pdf");
        return bookingService.downloadSignedPdf(id);
    }
}
