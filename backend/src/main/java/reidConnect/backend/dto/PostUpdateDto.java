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

<<<<<<<< Updated upstream:backend/src/main/java/reidConnect/backend/dto/PostUpdateDto.java
public class PostUpdateDto {
========
public class PostResponseDto {
    private Long id;
    private Long clubId;
    private String title;
>>>>>>>> Stashed changes:backend/src/main/java/reidConnect/backend/dto/PostResponseDto.java
    private String description;
    private List<String> mediaPaths;
}
