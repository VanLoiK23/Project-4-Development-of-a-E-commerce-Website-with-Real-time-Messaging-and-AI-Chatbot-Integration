package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CTSanPhamRequest {
    private Long maImei;
    private Integer maphienbansp;
    private Integer maphieunhap;
    private Integer maphieuxuat;
    private Integer tinhTrang;
}
