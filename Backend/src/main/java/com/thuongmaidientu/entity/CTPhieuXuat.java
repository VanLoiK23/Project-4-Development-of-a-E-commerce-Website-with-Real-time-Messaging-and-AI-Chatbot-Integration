package com.thuongmaidientu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chitietphieuxuat")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CTPhieuXuat {

	@EmbeddedId
	private CTPhieuXuatKey id;

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE )
	@JoinColumn(name = "maphieuxuat", insertable = false, updatable = false)
	private PhieuXuatEntity phieuXuat;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "maphienbansp", insertable = false, updatable = false)
	private ProductVariantEntity phienBanSanPhamXuat;

	@Column(name = "code_cart", length = 50, nullable = true)
	private String codeCart="";

	@Column(name = "soluong", nullable = false)
	private Integer soLuong = 0;

	@Column(name = "dongia", nullable = false)
	private Integer donGia = 0;
}

