package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class CommentResponseDto {
    private Long id;
    private String content;
    private String userName;
    private LocalDateTime createdAt;
    private List<CommentResponseDto> replies;
}
