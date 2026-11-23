package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhieuXuatResponse {
    private Integer id;
    private java.util.Date thoiGian;
    private java.math.BigDecimal tongTien;
    private Integer makh;
    private String codeCart;
    private Integer status;
    private String payment;
    private Integer cartShipping;
    private Integer discountCode;
    private String save;
    private Integer feeTransport;
    private String feeback;
    private java.util.Date updatedAt;
}
