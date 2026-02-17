package reidConnect.backend.controller;

import org.springframework.web.bind.annotation.RequestParam;
import reidConnect.backend.dto.UpdateProfileDto;
import reidConnect.backend.dto.UserWithProfileDto;
import reidConnect.backend.dto.student.PasswordChangeRequest;
import reidConnect.backend.dto.PasswordChangeResponse;
import reidConnect.backend.entity.User;

import reidConnect.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileDto updateProfileDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User updatedUser = userService.updateProfile(currentUser, updateProfileDto.getUsername(),
                updateProfileDto.getEmail());
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        userService.deleteUser(currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    public ResponseEntity<UserWithProfileDto> getUserByRegNumber(@RequestParam("regNumber") String regNumber) {
        return ResponseEntity.ok(userService.getUserByRegNumber(regNumber));
    }

    @PutMapping("/change-password")
    public ResponseEntity<PasswordChangeResponse> changePassword(@RequestBody PasswordChangeRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();

            userService.changePassword(currentUser.getEmail(), request);
            return ResponseEntity.ok(PasswordChangeResponse.success("Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(PasswordChangeResponse.error(e.getMessage()));
        }
    }
}