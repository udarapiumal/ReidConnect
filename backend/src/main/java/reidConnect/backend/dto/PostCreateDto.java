package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class PostCreateDto {
    private Long clubId;
    private String description;
    private List<String> mediaPaths; // paths like ["img1.jpg", "img2.png"]
    private Long eventId;
}