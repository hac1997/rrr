package edu.ifsc.reevo.dto;

import edu.ifsc.reevo.util.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
    @NotBlank @Email String email,
    @NotBlank @ValidPassword String password
) {}