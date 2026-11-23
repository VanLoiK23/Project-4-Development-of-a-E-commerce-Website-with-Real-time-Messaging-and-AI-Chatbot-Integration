package com.thuongmaidientu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thuongmaidientu.entity.RefreshToken;
import com.thuongmaidientu.entity.UserEntity;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(UserEntity user);

    void deleteByToken(String token);
}