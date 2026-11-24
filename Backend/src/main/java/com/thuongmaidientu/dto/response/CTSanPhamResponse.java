package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CTSanPhamResponse {
    private Long maImei;
    private Integer maphienbansp;
    private Integer maphieunhap;
    private Integer maphieuxuat;
    private Integer tinhTrang;
}
