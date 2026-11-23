package com.thuongmaidientu.api.web;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thuongmaidientu.dto.request.ForgotPasswordRequest;
import com.thuongmaidientu.dto.request.LoginRequest;
import com.thuongmaidientu.dto.request.RegisterRequest;
import com.thuongmaidientu.dto.request.ResetPasswordRequest;
import com.thuongmaidientu.dto.request.ValidateRequestDTO;
import com.thuongmaidientu.dto.response.AccountResponse;
import com.thuongmaidientu.dto.response.LoginResponse;
import com.thuongmaidientu.dto.response.MessageResponse;
import com.thuongmaidientu.entity.UserEntity;
import com.thuongmaidientu.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("authResController")
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
		return ResponseEntity.ok(authService.login(request, response));
	}

	@PostMapping("/logout")
	public ResponseEntity<MessageResponse> logout(
			@CookieValue(name = "refresh_token", required = false) String refreshToken, HttpServletResponse response) {

		authService.logout(refreshToken, response);
		return ResponseEntity.ok(MessageResponse.builder().message("Đăng xuất thành công").build());
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(@CookieValue(name = "refresh_token", required = false) String refreshToken) {
		return ResponseEntity.ok(Map.of("accessToken", authService.refreshToken(refreshToken)));
	}

	@PostMapping("/register")
	public ResponseEntity<AccountResponse> registerAccount(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerAccount(request));
	}

	@PostMapping("send-otp-check-email")
	public ResponseEntity<?> sendOTP(@RequestBody @Valid ValidateRequestDTO request) {
		boolean isSuccess = authService.generateOTPAndSendMail(request.getEmail());

		return ResponseEntity.ok(Map.of("isSuccess", isSuccess));
	}

	@PostMapping("verify-otp")
	public ResponseEntity<?> confirmEmailValid(@RequestBody @Valid ValidateRequestDTO request) {
		if (request.getOtp() == null || request.getOtp().isBlank()) {
			throw new IllegalArgumentException("OTP is required !");
		}

		boolean success = authService.verifyOTP(request.getEmail(), request.getOtp());

		return ResponseEntity.ok(Map.of("success", success));
	}

	@GetMapping("/account")
	public ResponseEntity<AccountResponse> findAccount(Authentication authentication) {
		UserEntity user = currentUser(authentication);

		return ResponseEntity.ok(authService.findAccount(user.getEmail()));
	}

	@PostMapping("forgot-password")
	public ResponseEntity<?> sendEmailForgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {

		boolean success = authService.generateTokenAndSendMailReset(request.getEmail());

		return ResponseEntity.ok(Map.of("success", success));
	}

	@PostMapping("reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {

		boolean success = authService.resetPassword(request.getToken(), request.getPassword());

		return ResponseEntity.ok(Map.of("success", success));
	}

	private UserEntity currentUser(Authentication authentication) {

		if (authentication == null || authentication.getPrincipal() == null) {

			throw new IllegalStateException("Không xác định được người dùng hiện tại");
		}

		return (UserEntity) authentication.getPrincipal();
	}

}