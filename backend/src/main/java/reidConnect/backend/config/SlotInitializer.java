package reidConnect.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reidConnect.backend.entity.Slot;
import reidConnect.backend.repository.SlotRepository;

import java.time.LocalTime;

@Configuration
public class SlotInitializer {

    @Bean
    public CommandLineRunner loadSlots(SlotRepository slotRepository) {
        return args -> {
            LocalTime start = LocalTime.of(8, 0);
            LocalTime end = LocalTime.of(19, 0);

            while (start.isBefore(end)) {
                LocalTime slotEnd = start.plusMinutes(30);
                boolean exists = slotRepository.existsByStartTimeAndEndTime(start, slotEnd);
                if (!exists) {
                    slotRepository.save(new Slot(null, start, slotEnd));
                }
                start = slotEnd;
            }
        };
    }

}
