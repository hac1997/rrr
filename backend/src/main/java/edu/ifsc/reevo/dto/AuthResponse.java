package edu.ifsc.reevo.dto;

import lombok.Builder;

@Builder
public record AuthResponse(
    String token,
    String refreshToken,
    String email,
    String userType,
    Long userId
) {}
