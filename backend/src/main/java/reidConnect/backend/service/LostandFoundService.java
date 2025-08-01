package reidConnect.backend.service;

import org.springframework.stereotype.Service;
import reidConnect.backend.dto.LostandFoundDto;
import reidConnect.backend.dto.LostandFoundResponseDto;
import reidConnect.backend.entity.LostandFound;
import reidConnect.backend.repository.LostandFoundRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
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


        if (lostandFoundDto.getImage() != null && !lostandFoundDto.getImage().isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + lostandFoundDto.getImage().getOriginalFilename();

            try {

                Path uploadDir = Paths.get(System.getProperty("user.dir"), "src", "main", "resources", "static", "uploads");
                Files.createDirectories(uploadDir);

                Path filePath = uploadDir.resolve(fileName);
                lostandFoundDto.getImage().transferTo(filePath.toFile());
                lostandFound.setImagePath(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }

        lostandFoundRepository.save(lostandFound);
    }
    public List<LostandFoundResponseDto> getAllLostItems() {
        List<LostandFound> items = lostandFoundRepository.findAll();

        return items.stream().map(item -> {
            String imageUrl = item.getImagePath() != null
                    ? "http://localhost:8080/uploads/" + item.getImagePath()  // or your actual base path
                    : null;

            return new LostandFoundResponseDto(
                    item.getId(),
                    item.getItemName(),
                    item.getCategory(),
                    item.getDescription(),
                    item.getLocation(),
                    item.getDateLost(),
                    imageUrl,
                    item.getPosterName(),
                    item.getContactNumber()
            );
        }).toList();
    }
    public void deleteLostItem(Long id) {
        lostandFoundRepository.deleteById(id);
    }
    public void updateLostItem(Long id, LostandFoundDto dto) {
        LostandFound item = lostandFoundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setItemName(dto.getItemName());
        item.setCategory(dto.getCategory());
        item.setDescription(dto.getDescription());
        item.setLocation(dto.getLocation());
        item.setDateLost(dto.getDateLost());
        item.setPosterName(dto.getPosterName());
        item.setContactNumber(dto.getContactNumber());

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + dto.getImage().getOriginalFilename();
            try {
                Path uploadDir = Paths.get(System.getProperty("user.dir"), "src", "main", "resources", "static", "uploads");
                Files.createDirectories(uploadDir);
                Path filePath = uploadDir.resolve(fileName);
                dto.getImage().transferTo(filePath.toFile());
                item.setImagePath(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to update image", e);
            }
        }

        lostandFoundRepository.save(item);
    }

}
