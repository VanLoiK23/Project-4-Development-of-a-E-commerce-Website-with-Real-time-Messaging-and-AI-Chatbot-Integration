package com.thuongmaidientu.dto.response;

import java.util.Date;

import com.thuongmaidientu.statusEnum.AccountRole;
import com.thuongmaidientu.statusEnum.AccountStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {

    private Long id;
    private String fullName;
    private String email;
    private String username;
    private AccountRole role;
    private AccountStatus status;
    private Date createdAt;
}