package com.thuongmaidientu.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ThongkeDTO {

	private Integer quantityWareHouse;

	private Integer quantityUser;

	private Integer quantityProduct;

	private Integer quantityPurchase;

	private List<String> revenue;
	private List<Integer> orders;
	private List<Integer> statusData;
	private List<String> topProducts;
	private List<Integer> topValues;
	private List<String> importData;
	private List<String> exportData;
	
}
