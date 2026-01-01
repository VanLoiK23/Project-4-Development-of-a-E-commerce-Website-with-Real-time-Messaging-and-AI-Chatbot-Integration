package com.thuongmaidientu.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class PhieuXuatDTO extends AbstractDTO<PhieuXuatDTO> {

	private Date thoiGian;

	private BigDecimal tongTien;

	private Integer IDKhachHang;

	private String khachHangName;
	
	private String diaChi;

	private String sdt;

	private String codeCart;

	private String payment;

	private Integer cartShipping;

	private Integer discountCode;
	private Integer amountDiscount;
	private String discountCodeRaw;

	private Integer makh;

	private String save;

	private Integer feeTransport;

	private String feeback;

	private Integer num_trash;
	
	private Date date;

	private List<Map<String, Object>> product_info;
	
	private List<ProductDTO> listProductDTOsForDisplay;
	private List<ProductDTO> listProductDTOsForComment;
	
	//info for order side android
	private DiscountDTO InfoOrderDiscount;
	private List<ChiTietPhieuXuatDTO> listctpx;
	private String name;
	private String phone;
	private String address;
	
	private Integer totalQuantity;

}
