package com.thuongmaidientu.dto;

import lombok.Data;

@Data
public class VNPayDTO extends AbstractDTO<VNPayDTO> {

	private String vnp_TmnCode;

	private Long vnp_TxnRef;

	private String vnp_Amount;

	private String vnp_OrderInfo;

	private String vnp_OrderType;

	private Long vnp_TransactionNo;

	private String vnp_CardType;

	private String codeCart;
	
}
