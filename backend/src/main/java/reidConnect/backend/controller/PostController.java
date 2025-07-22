package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.PostCreateDto;
import reidConnect.backend.dto.PostResponseDto;
import reidConnect.backend.dto.PostUpdateDto;
import reidConnect.backend.service.PostService;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_CLUB')")
    public ResponseEntity<String> createPost(
            @RequestParam("clubId") Long clubId,
            @RequestParam("description") String description,
            @RequestParam(value = "media", required = false) List<MultipartFile> mediaFiles,
            @RequestParam(value = "eventId", required = false) Long eventId) {

        try {
            // 1. Save files to /static/uploads/ and collect their paths
            List<String> savedFileNames = new ArrayList<>();

            if (mediaFiles != null && !mediaFiles.isEmpty()) {
                Path uploadDir = Paths.get("src/main/resources/static/uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    System.out.println("📁 Created upload directory: " + uploadDir);
                }

                for (MultipartFile file : mediaFiles) {
                    if (file.isEmpty()) {
                        System.out.println("⚠️ Skipping empty file");
                        continue;
                    }

                    String originalFilename = file.getOriginalFilename();
                    if (originalFilename == null || originalFilename.isBlank()) {
                        System.out.println("⚠️ Skipping file with null/blank name");
                        continue;
                    }

                    String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;
                    Path filePath = uploadDir.resolve(uniqueFileName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    savedFileNames.add("uploads/" + uniqueFileName);
                    System.out.println("💾 Saved file: " + uniqueFileName);
                }
            }

            // 2. Build DTO and send to service
            PostCreateDto dto = new PostCreateDto();
            dto.setClubId(clubId);
            dto.setDescription(description);
            dto.setMediaPaths(savedFileNames);
            dto.setEventId(eventId); // ✅ Set eventId in DTO

            postService.createPost(dto);

            return ResponseEntity.ok("Post created successfully with " + savedFileNames.size() + " media files.");

        } catch (Exception e) {
            System.err.println("❌ Error creating post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating post: " + e.getMessage());
        }
    }



    //Get all posts
    @PreAuthorize("hasRole('ROLE_CLUB') or hasRole('ROLE_STUDENT')")
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        List<PostResponseDto> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    //Get a post by ID
    @PreAuthorize("hasAnyRole('CLUB', 'UNION')" +
            "")
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long id) {
        PostResponseDto post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    // Get all posts by club ID
    @PreAuthorize("hasAnyRole('CLUB', 'UNION')")
    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByClubId(@PathVariable Long clubId) {
        List<PostResponseDto> posts = postService.getPostsByClubId(clubId);
        return ResponseEntity.ok(posts);
    }

    // Get the latest 3 posts by club ID
    @PreAuthorize("hasRole('ROLE_CLUB')")
    @GetMapping("/club/{clubId}/latest")
    public ResponseEntity<List<PostResponseDto>> getLatestThreePostsByClubId(@PathVariable Long clubId) {
        List<PostResponseDto> posts = postService.getLatestThreePostsByClubId(clubId);
        return ResponseEntity.ok(posts);
    }


    //Update a post by ID
    @PreAuthorize("hasRole('ROLE_CLUB')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody PostUpdateDto dto) {
        postService.updatePost(id, dto);
        return ResponseEntity.ok("Post updated successfully.");
    }

    //Delete a post by ID
    @PreAuthorize("hasRole('ROLE_CLUB')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted successfully.");
    }

    // Add a like to a post
    @PreAuthorize("hasRole('ROLE_CLUB') or hasRole('ROLE_STUDENT')")
    @PostMapping("/{postId}/like")
    public ResponseEntity<String> likePost(
            @PathVariable Long postId,
            @RequestParam Long userId) {
        postService.likePost(postId, userId);
        return ResponseEntity.ok("Post liked successfully.");
    }

    // Remove a like (unlike) a post
    @DeleteMapping("/{postId}/like")
    public ResponseEntity<String> unlikePost(
            @PathVariable Long postId,
            @RequestParam Long userId) {
        postService.unlikePost(postId, userId);
        return ResponseEntity.ok("Post unliked successfully.");
    }

    // Get total like count for a post
    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        long count = postService.getLikeCount(postId);
        return ResponseEntity.ok(count);
    }

    // Get all posts related to an event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByEventId(@PathVariable Long eventId) {
        List<PostResponseDto> posts = postService.getPostsByEventId(eventId);
        return ResponseEntity.ok(posts);
    }

    // Total number of posts for a club
    @PreAuthorize("hasAnyRole('CLUB', 'UNION')")
    @GetMapping("/club/{clubId}/count")
    public ResponseEntity<Long> getTotalPostCount(@PathVariable Long clubId) {
        long count = postService.getTotalPostCountByClubId(clubId);
        return ResponseEntity.ok(count);
    }

    // Posts in the last 28 days for a club
    @PreAuthorize("hasAnyRole('CLUB', 'UNION')")
    @GetMapping("/club/{clubId}/count/recent")
    public ResponseEntity<Long> getRecentPostCount(@PathVariable Long clubId) {
        long count = postService.getRecentPostCountByClubId(clubId, 28);
        return ResponseEntity.ok(count);
    }


    // Serve uploaded images - accessible to all users (including students)
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = Paths.get("src/main/resources/static/uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                // Determine content type based on file extension
                String contentType = "application/octet-stream";
                if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600") // Cache for 1 hour
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Error serving image: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}

