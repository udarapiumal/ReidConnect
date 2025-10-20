package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.CommentRequestDto;
import reidConnect.backend.dto.CommentResponseDto;
import reidConnect.backend.dto.LatestCommentWithPostDto;
import reidConnect.backend.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // Add a comment or reply
    @PostMapping
    public ResponseEntity<String> addComment(@RequestBody CommentRequestDto dto) {
        commentService.addComment(dto);
        return ResponseEntity.ok("Comment added successfully");
    }

    // Get all comments for a post (tree structure)
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentService.getCommentsForPost(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Long> getCommentCount(@PathVariable Long postId) {
        long count = commentService.countCommentsForPost(postId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/club/{clubId}/latest")
    public ResponseEntity<List<LatestCommentWithPostDto>> getLatest3CommentsByClub(@PathVariable Long clubId) {
        List<LatestCommentWithPostDto> latestComments = commentService.getLatest3CommentsByClub(clubId);
        return ResponseEntity.ok(latestComments);
    }


}

