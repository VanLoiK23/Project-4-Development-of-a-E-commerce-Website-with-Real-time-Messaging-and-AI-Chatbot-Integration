package com.thuongmaidientu.dto;

import lombok.Data;

@Data
public class ProductVariantDTO {
	private String ram;
	private String rom;
	private String color;
	private String importPrice;
	private String exportPrice;
	private Integer existingVariantIds;
}
