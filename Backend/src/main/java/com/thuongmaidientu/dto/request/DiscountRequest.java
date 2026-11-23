package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountRequest {
    private Integer id;
    private String code;
    private Integer discountAmount;
    private Integer numberUsed;
    private java.util.Date expirationDate;
    private Integer paymentLimit;
    private String description;
    private java.util.Date created;
    private String trash;
    private java.util.Date deleteAt;
    private Integer status;
}
