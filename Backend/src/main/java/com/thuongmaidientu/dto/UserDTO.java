package com.thuongmaidientu.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.thuongmaidientu.statusEnum.AccountRole;
import com.thuongmaidientu.statusEnum.AccountStatus;

import lombok.Data;

@Data
public class UserDTO extends AbstractDTO<UserDTO>{
	
    private String name;

    private String username;
    
    private String firstName;
    private String lastName;
    private boolean isAdmin=false;

    private String phone;

    private String email;

    private Date ngaySinh;

    private String gender;
    
    @JsonProperty("ngaysinh")
    private String bod;

    private String password;
    private String passwordRaw;

    private AccountRole role;

    private Date timeCreateAcc;

    private String resetTokenHash;
    
    private Integer num_trash;

    private Date resetTokenExpiresAt;
    
    @JsonProperty("status")
    private AccountStatus statusString;
}
