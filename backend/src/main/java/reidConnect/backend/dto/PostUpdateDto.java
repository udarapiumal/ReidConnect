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

public class PostUpdateDto {
    private Long id;
    private Long clubId;
    private String title;
    private String description;
    private List<String> mediaPaths;
    private Long eventId;
    private boolean active;
}
