package edu.ifsc.reevo.controller;

import edu.ifsc.reevo.dto.*;
import edu.ifsc.reevo.model.User;
import edu.ifsc.reevo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @PostMapping("/auth")
    public ResponseEntity<AuthResponse> authUser(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(userService.authUser(request));
    }

    @PostMapping
    public ResponseEntity<?> addUser(@Valid @RequestBody DtoRequest.UserRequestDTO requestDTO) {
        try {
            return ResponseEntity.ok(userService.addUser(requestDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody DtoRequest.UserRequestDTO userRequestDTO,
            @Valid @RequestBody DtoRequest.ProfileRequestDTO profileRequestDTO) {
        return ResponseEntity.ok(userService.updateUserById(userRequestDTO, profileRequestDTO));
    }

    @PatchMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
        userService.deactivatingUser(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<UserDashboardDTO> getUserByEmail(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getStats(userId));
    }
}