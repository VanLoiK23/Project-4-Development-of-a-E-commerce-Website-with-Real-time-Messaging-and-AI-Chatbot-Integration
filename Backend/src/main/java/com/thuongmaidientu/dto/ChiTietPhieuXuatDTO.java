package com.thuongmaidientu.dto;

import lombok.Data;

@Data
public class ChiTietPhieuXuatDTO {

	private Integer phieuXuatId;

	private Integer phienBanSanPhamXuatId;

	private String codeCart;

	private Integer soLuong;

	private Integer donGia;
	
	
	//return to Android
	private String tenSP;
	private String config;
	private String srcImage;
	private Integer maSP;
	
	//display order side admin web
	private Integer ram;
	private Integer rom;
	private String color;
}

