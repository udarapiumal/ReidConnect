package reidConnect.backend.service;

import org.springframework.stereotype.Service;
import reidConnect.backend.dto.LostandFoundDto;
import org.springframework.web.multipart.MultipartFile;
import reidConnect.backend.entity.LostandFound;
import reidConnect.backend.repository.LostandFoundRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LostandFoundService {

    private final LostandFoundRepository lostandFoundRepository;

    public LostandFoundService(LostandFoundRepository lostandFoundRepository) {
        this.lostandFoundRepository = lostandFoundRepository;
    }

    public void saveLostItem(LostandFoundDto lostandFoundDto) {
        LostandFound lostandFound = new LostandFound();
        lostandFound.setItemName(lostandFoundDto.getItemName());
        lostandFound.setCategory(lostandFoundDto.getCategory());
        lostandFound.setDescription(lostandFoundDto.getDescription());
        lostandFound.setLocation(lostandFoundDto.getLocation());
        lostandFound.setDateLost(lostandFoundDto.getDateLost());
        lostandFound.setPosterName(lostandFoundDto.getPosterName());
        lostandFound.setContactNumber(lostandFoundDto.getContactNumber());

        // Handle image saving
        if (lostandFoundDto.getImage() != null && !lostandFoundDto.getImage().isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + lostandFoundDto.getImage().getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);

            try {
                Files.createDirectories(filePath.getParent());
                lostandFoundDto.getImage().transferTo(filePath.toFile());
                lostandFound.setImagePath(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }

        lostandFoundRepository.save(lostandFound);
    }
}
