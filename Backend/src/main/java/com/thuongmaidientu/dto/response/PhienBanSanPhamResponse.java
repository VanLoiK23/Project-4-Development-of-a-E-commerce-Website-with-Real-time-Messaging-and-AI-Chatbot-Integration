package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhienBanSanPhamResponse {
    private Integer maPhienBanSP;
    private Integer masp;
    private Integer romId;
    private Integer ramId;
    private Integer mausacId;
    private Integer giaNhap;
    private Integer giaXuat;
    private Integer soLuongTon;
    private Double sale;
    private Integer priceSale;
}
