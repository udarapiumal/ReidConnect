package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LatestCommentWithPostDto {
    private CommentResponseDto comment;
    private String postImageUrl;
    private String postDescription;
    private Long postId;

}
