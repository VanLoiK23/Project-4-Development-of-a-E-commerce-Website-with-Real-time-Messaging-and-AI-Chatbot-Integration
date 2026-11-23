package com.thuongmaidientu.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mausac")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MauSacEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mamausac")
    private Integer maMauSac;

    @Column(name = "tenmausac", length = 255, nullable = false)
    private String tenMauSac;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "trash", length = 10, nullable = false)
    private String trash = "active";

    @Column(name = "delete_at",nullable = true)
    @Temporal(TemporalType.DATE)
    private Date deletedAt;
    
    @OneToMany(mappedBy = "mauSac")
    private List<PhienBanSanPhamEntity> listProductByColor = new ArrayList<>();
}
