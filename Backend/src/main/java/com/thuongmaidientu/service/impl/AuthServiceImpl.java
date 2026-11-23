package com.thuongmaidientu.service.impl;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thuongmaidientu.config.JwtProvider;
import com.thuongmaidientu.dto.request.LoginRequest;
import com.thuongmaidientu.dto.request.RegisterRequest;
import com.thuongmaidientu.dto.response.AccountResponse;
import com.thuongmaidientu.dto.response.LoginResponse;
import com.thuongmaidientu.dto.response.TokenResponse;
import com.thuongmaidientu.entity.RefreshToken;
import com.thuongmaidientu.entity.UserEntity;
import com.thuongmaidientu.exception.AccountLockedException;
import com.thuongmaidientu.exception.EmailAlreadyExistsException;
import com.thuongmaidientu.exception.InvalidCredentialsException;
import com.thuongmaidientu.exception.RefreshTokenNotFoundException;
import com.thuongmaidientu.mapper.UserMapper;
import com.thuongmaidientu.repository.RefreshTokenRepository;
import com.thuongmaidientu.repository.UserRepository;
import com.thuongmaidientu.service.AuthService;
import com.thuongmaidientu.service.EmailService;
import com.thuongmaidientu.statusEnum.AccountRole;
import com.thuongmaidientu.statusEnum.AccountStatus;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final RedisTemplate<String, Object> redisTemplate;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;

    private final UserMapper mapper;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        UserEntity user = findUserByEmailOrUsername(request.getUserNameOrEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email/username hoặc mật khẩu không chính xác"));

        if (user.getStatus() == AccountStatus.LOCKED) {
            throw new AccountLockedException();
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Email/username hoặc mật khẩu không chính xác");
        }

        TokenResponse token = issueTokenPair(user, response);

        return LoginResponse.builder().token(token).user(toAccountResponse(user)).build();
    }

    @Override
    @Transactional
    public void logout(String refreshToken, HttpServletResponse response) {
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken).ifPresent(refreshTokenRepository::delete);
        }

        Cookie cookie = new Cookie("refresh_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);
        log.info("Đã xóa phiên đăng xuất và xóa Cookie refresh_token.");
    }

    @Override
    @Transactional
    public String refreshToken(String rawToken) {
        if (rawToken == null || !jwtProvider.validateToken(rawToken)) {
            throw new RefreshTokenNotFoundException();
        }

        RefreshToken storedToken = refreshTokenRepository.findByToken(rawToken)
                .orElseThrow(RefreshTokenNotFoundException::new);

        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new RefreshTokenNotFoundException();
        }

        UserEntity user = storedToken.getUser();

        if (user.getStatus() == AccountStatus.LOCKED) {
            refreshTokenRepository.delete(storedToken);
            throw new AccountLockedException();
        }

        String accessToken = jwtProvider.generateAccessToken(user);

        return accessToken;
    }

    @Override
    @Transactional
    public AccountResponse registerAccount(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        String fullName = request.getLastName() + " " + request.getFirstName();
        String userName = request.getLastName() + request.getFirstName();

        UserEntity user = mapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(fullName);
        user.setUsername(userName.toLowerCase());

        UserEntity saved = userRepository.save(user);

        return toAccountResponse(saved);
    }

    @Override
    @Transactional
    public boolean generateOTPAndSendMail(String email) {
        String key = "OTP_" + email;

        SecureRandom random = new SecureRandom();

        String otp = String.format("%06d", random.nextInt(1000000));

        redisTemplate.opsForValue().set(key, otp, 5, TimeUnit.MINUTES);

        return emailService.sendOTPEmail(email, otp);
    }

    @Override
    public boolean verifyOTP(String email, String OTP) {
        String key = "OTP_" + email;

        String realOTP = (String) redisTemplate.opsForValue().get(key);

        if (!realOTP.equals(OTP)) {
            return false;
        }
        redisTemplate.delete(key);

        return true;
    }

    private TokenResponse issueTokenPair(UserEntity user, HttpServletResponse response) {
        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshTokenValue = jwtProvider.generateRefreshToken(user);

        long expiryMs = jwtProvider.getRefreshTokenExpirationMs();
        RefreshToken refreshToken = RefreshToken.builder().token(refreshTokenValue)
                .expiryDate(LocalDateTime.now().plus(Duration.ofMillis(expiryMs))).user(user).build();

        refreshTokenRepository.save(refreshToken);

        Cookie cookie = new Cookie("refresh_token", refreshTokenValue);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) (expiryMs / 1000));

        response.addCookie(cookie);

        return TokenResponse.builder().accessToken(accessToken).tokenType("Bearer")
                .expiresIn(jwtProvider.getAccessTokenExpirationMs() / 1000).build();
    }

    private Optional<UserEntity> findUserByEmailOrUsername(String emailOrUsername) {
        return userRepository.findByEmail(emailOrUsername).or(() -> userRepository.findByName(emailOrUsername));
    }

    private AccountResponse toAccountResponse(UserEntity user) {
        return AccountResponse.builder().id(user.getId()).fullName(user.getName()).email(user.getEmail())
                .role(user.getRole()).status(user.getStatus()).username(user.getUsername()).createdAt(user.getTimeCreateAcc()).build();
    }

    @Override
    public AccountResponse findAccount(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User with email:" + email + " not found"));

        return toAccountResponse(user);
    }

    @Override
    public boolean generateTokenAndSendMailReset(String email) {
        userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Email not found"));

        String resetToken = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set("RESET_" + resetToken, email, 15, TimeUnit.MINUTES);

        return emailService.sendResetEmail(email, resetToken);
    }

    @Override
    public boolean resetPassword(String token, String password) {
        String key = "RESET_" + token;

        String email = (String) redisTemplate.opsForValue().get(key);

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Token is expired or is incorrect");
        }

        UserEntity userEntity = userRepository.findByEmail(email).orElse(null);

        if (userEntity == null) {
            throw new IllegalArgumentException("Email not found");
        }
        userEntity.setPassword(passwordEncoder.encode(password));

        userRepository.save(userEntity);

        redisTemplate.delete(key);

        return true;
    }

}