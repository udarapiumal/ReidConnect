package reidConnect.backend.mapper;

import reidConnect.backend.dto.PostCreateDto;
import reidConnect.backend.dto.PostResponseDto;
import reidConnect.backend.dto.PostUpdateDto;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.Event;
import reidConnect.backend.entity.Post;
import reidConnect.backend.entity.Post_Media;

import java.util.List;

public class PostMapper {

    public static Post mapToPost(PostCreateDto dto, Club club, Event event) {
        Post post = new Post();
        post.setClub(club);
        post.setDescription(dto.getDescription());
        post.setEvent(event);
        return post;
    }


    public static Post updatePostFromDto(PostUpdateDto dto, Post post, Event event) {
        post.setDescription(dto.getDescription());
        post.setEvent(event);
        return post;
    }

    public static PostResponseDto mapToPostResponseDto(Post post, List<Post_Media> mediaList) {
        List<String> paths = mediaList.stream()
                .map(Post_Media::getMedia_path)
                .toList();

        return new PostResponseDto(
                post.getId(),
                post.getClub().getId(),
                post.getCreatedAt(),
                post.getDescription(),
                paths,
                post.getEvent() != null ? post.getEvent().getId() : null
        );
    }

    public static List<Post_Media> mapToPostMediaList(List<String> mediaPaths, Post post) {
        return mediaPaths.stream()
                .map(path -> new Post_Media(null, post, path))
                .toList();
    }
}
