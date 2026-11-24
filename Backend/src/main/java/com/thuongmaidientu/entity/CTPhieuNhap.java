package com.thuongmaidientu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chitietphieunhap")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CTPhieuNhap {

	@EmbeddedId
	private CTPhieuNhapKey id;

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE )
	@JoinColumn(name = "maphieunhap", insertable = false, updatable = false)
	private PhieuNhapEntity phieunhap;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "maphienbansp", insertable = false, updatable = false)
	private ProductVariantEntity phienBanSanPhamNhap;

	@Column(name = "soluong", nullable = false)
	private Integer soLuong = 0;

	@Column(name = "dongia", nullable = false)
	private Integer donGia = 0;
}


