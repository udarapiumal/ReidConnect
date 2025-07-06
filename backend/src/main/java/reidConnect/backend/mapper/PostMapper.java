package reidConnect.backend.mapper;

import reidConnect.backend.dto.PostDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.Post;

public class PostMapper {

    public static PostDto mapToPostDto(Post post) {
        return new PostDto(
                post.getId(),
                post.getClub().getId(),
                post.getTitle(),
                post.getDescription()
        );
    }

    public static Post mapToPost(PostDto postDto, Club club) {
        return new Post(
          postDto.getId(),
          club,
          postDto.getTitle(),
          postDto.getDescription()
        );
    }
}
