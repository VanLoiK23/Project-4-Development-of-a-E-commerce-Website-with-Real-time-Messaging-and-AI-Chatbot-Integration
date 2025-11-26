package com.thuongmaidientu.dto;

import java.util.List;

import lombok.Data;

@Data
public class PaymentSavePending {
	//info payment
	private List<String> productName;
	private Integer toalAmount;
	private List<Integer> quantity;
	private List<Integer> unitPrice;
	private List<String> capacity;
	private List<String> color;
	
	//info address shipping
	private String username;
	private String email;
	private String phone;
	private String streetName;
	private String district;
	private String city;
	private String country;
	private String note;
	private Integer idShipping;
}
