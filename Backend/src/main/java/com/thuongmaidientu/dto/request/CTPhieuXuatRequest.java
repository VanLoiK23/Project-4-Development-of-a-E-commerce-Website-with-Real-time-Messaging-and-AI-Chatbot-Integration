package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CTPhieuXuatRequest {
    private Integer maPhieuXuat;
    private Integer maPhienBanSP;
    private String codeCart;
    private Integer soLuong;
    private Integer donGia;
}
