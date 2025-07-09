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
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<String> createPost(
            @RequestParam("clubId") Long clubId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "media", required = false) List<MultipartFile> mediaFiles) {

        try {
            System.out.println("📥 Received POST request to /api/posts");
            System.out.println("📝 Club ID: " + clubId);
            System.out.println("📝 Title: " + title);
            System.out.println("📝 Description: " + description);
            System.out.println("📁 Media files count: " + (mediaFiles != null ? mediaFiles.size() : 0));

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

                    // Give it a unique filename to avoid collisions
                    String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;
                    Path filePath = uploadDir.resolve(uniqueFileName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    savedFileNames.add("uploads/" + uniqueFileName); // relative path for access
                    System.out.println("💾 Saved file: " + uniqueFileName);
                }
            }

            // 2. Build DTO and send to service
            PostCreateDto dto = new PostCreateDto();
            dto.setClubId(clubId);
            dto.setTitle(title);
            dto.setDescription(description);
            dto.setMediaPaths(savedFileNames); // set string paths

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
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        List<PostResponseDto> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    //Get a post by ID
    @PreAuthorize("hasRole('CLUB')")
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long id) {
        PostResponseDto post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    //Update a post by ID
    @PreAuthorize("hasRole('CLUB')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody PostUpdateDto dto) {
        postService.updatePost(id, dto);
        return ResponseEntity.ok("Post updated successfully.");
    }

    //Delete a post by ID
    @PreAuthorize("hasRole('CLUB')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted successfully.");
    }
}

