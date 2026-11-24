package com.thuongmaidientu.dto.response;

import com.thuongmaidientu.statusEnum.AccountRole;
import com.thuongmaidientu.statusEnum.AccountStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer id;
    private String name;
    private String username;
    private String phone;
    private String email;
    private java.util.Date ngaySinh;
    private String gender;
    private String password;
    private AccountRole role;
    private java.util.Date timeCreateAcc;
    private String resetTokenHash;
    private java.util.Date resetTokenExpiresAt;
    private AccountStatus status;
    private java.util.Date deletedAt;
}
