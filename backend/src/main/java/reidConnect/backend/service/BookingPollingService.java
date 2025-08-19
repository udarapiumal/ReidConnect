package reidConnect.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reidConnect.backend.entity.VenueBooking;
import reidConnect.backend.enums.BookingStatus;
import reidConnect.backend.repository.VenueBookingRepository;
import reidConnect.backend.service.impl.BookingServiceImpl;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingPollingService {

    private final VenueBookingRepository bookingRepo;
    private final BookingServiceImpl bookingService;

    @Scheduled(fixedDelay = 1000000)
    public void checkPendingBookings() {
        List<VenueBooking> pendingBookings = bookingRepo.findByStatus(BookingStatus.PENDING);

        for (VenueBooking booking : pendingBookings) {
            try {
                bookingService.updateStatusFromEnvelope(booking.getId());
                log.info("Updated booking {} from envelope", booking.getId());
            } catch (Exception e) {
                log.error("Failed to update booking {}", booking.getId(), e);
            }
        }
    }
}
