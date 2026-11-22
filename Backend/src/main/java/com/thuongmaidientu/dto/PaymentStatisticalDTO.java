package com.thuongmaidientu.dto;

import java.util.List;

import lombok.Data;

@Data
public class PaymentStatisticalDTO {
	private Integer id;
	private String name;
	private String status;
	private String date;
	private String total;
	private List<Integer> history;
}
