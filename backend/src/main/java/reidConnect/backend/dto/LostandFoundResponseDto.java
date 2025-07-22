package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LostandFoundResponseDto {
    private Long id;
    private String itemName;
    private String category;
    private String description;
    private String location;
    private LocalDate dateLost;
    private String imageUrl;
    private String posterName;
    private String contactNumber;
}
