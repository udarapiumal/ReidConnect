package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagedPostResponseDto {
    private List<PostResponseDto> posts;
    private int currentPage;
    private int totalPages;
    private long totalItems;
    private int pageSize;
}
