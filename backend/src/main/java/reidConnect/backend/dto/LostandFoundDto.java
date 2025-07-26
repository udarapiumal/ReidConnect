package reidConnect.backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
public class LostandFoundDto {

    private String itemName;
    private String category;
    private String description;
    private String location;
    private LocalDate dateLost;
    private MultipartFile image;
    private String posterName;
    private String contactNumber;
}
