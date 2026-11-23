package com.thuongmaidientu.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.thuongmaidientu.statusEnum.AccountRole;
import com.thuongmaidientu.statusEnum.AccountStatus;

@Entity
@Table(name = "taikhoan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "username", length = 255, nullable = false)
    private String username;

    @Column(name = "phone", length = 10, nullable = false)
    private String phone;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "ngaysinh", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ngaySinh;

    @Column(name = "gender", length = 50, nullable = true)
    private String gender;

    @Column(name = "password", length = 255, nullable = true)
    private String password;

    @Column(name = "role", length = 50, nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'khách hàng'")
    @Default
    private AccountRole role = AccountRole.CUSTOMER;

    @Column(name = "time_create_acc", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date timeCreateAcc;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    @Column(name = "status", columnDefinition = "VARCHAR(20)")
    @Default
    private AccountStatus status = AccountStatus.ACTIVE;

    @Column(name = "deleted_at", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date deletedAt;
}
