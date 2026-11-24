package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CTPhieuXuatResponse {
    private Integer maPhieuXuat;
    private Integer maPhienBanSP;
    private String codeCart;
    private Integer soLuong;
    private Integer donGia;
}
