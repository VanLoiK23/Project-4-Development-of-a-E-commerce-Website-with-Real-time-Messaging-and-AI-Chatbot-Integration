package com.thuongmaidientu.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email/Username is required")
    @Email
    private String userNameOrEmail;

    @NotBlank(message = "Password is required")
    private String password;
}