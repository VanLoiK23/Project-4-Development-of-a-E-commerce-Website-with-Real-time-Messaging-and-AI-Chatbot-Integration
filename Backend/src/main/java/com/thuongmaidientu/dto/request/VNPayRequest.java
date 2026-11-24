package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VNPayRequest {
    private Integer id;
    private String vnp_TmnCode;
    private Long vnp_TxnRef;
    private String amount;
    private String orderInfo;
    private String orderType;
    private Long transId;
    private String payType;
    private String codeCart;
}
