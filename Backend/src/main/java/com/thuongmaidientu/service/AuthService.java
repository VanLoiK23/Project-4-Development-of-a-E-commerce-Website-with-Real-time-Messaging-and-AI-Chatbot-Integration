package com.thuongmaidientu.service;

import com.thuongmaidientu.dto.request.LoginRequest;
import com.thuongmaidientu.dto.request.RegisterRequest;
import com.thuongmaidientu.dto.response.AccountResponse;
import com.thuongmaidientu.dto.response.LoginResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request, HttpServletResponse response);

    void logout(String refreshToken, HttpServletResponse response);

    String refreshToken(String rawToken);

    AccountResponse registerAccount(RegisterRequest request);

    boolean generateOTPAndSendMail(String email);

    boolean verifyOTP(String email, String OTP);

    AccountResponse findAccount(String email);

    boolean generateTokenAndSendMailReset(String email);

    boolean resetPassword(String token, String password);
}