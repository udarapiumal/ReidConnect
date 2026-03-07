package reidConnect.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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

    @Value("${app.upload-dir:./uploads}")
    private String uploadDirPath;

    @Value("${app.backend-url:http://localhost:8080}")
    private String backendUrl;

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

        MultipartFile imageFile = lostandFoundDto.getImage();

        // ✅ Only handle upload if an image is actually provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

            try {
                Path uploadDir = Paths.get(uploadDirPath);
                Files.createDirectories(uploadDir);

                Path filePath = uploadDir.resolve(fileName);
                imageFile.transferTo(filePath.toFile());
                lostandFound.setImagePath(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        } else {
            // ✅ No image uploaded → set null or default placeholder
            lostandFound.setImagePath(null);
            // or: lostandFound.setImagePath("default.jpg");
        }

        lostandFoundRepository.save(lostandFound);
    }

    public List<LostandFoundResponseDto> getAllLostItems() {
        List<LostandFound> items = lostandFoundRepository.findAll();

        return items.stream().map(item -> {
            String imageUrl = item.getImagePath() != null
                    ? backendUrl + "/uploads/" + item.getImagePath()
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
                    item.getContactNumber());
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
                Path uploadDir = Paths.get(uploadDirPath);
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
