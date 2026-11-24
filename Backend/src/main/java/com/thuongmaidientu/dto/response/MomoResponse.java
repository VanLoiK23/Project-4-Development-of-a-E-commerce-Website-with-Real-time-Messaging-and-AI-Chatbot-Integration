package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MomoResponse {
    private Integer idMomo;
    private String partnerCode;
    private Long orderId;
    private String amount;
    private String orderInfo;
    private String orderType;
    private Long transId;
    private String payType;
    private String codeCart;
}
