package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThongTinGiaoHangRequest {
    private Integer id;
    private Integer idKh;
    private String hoVaTen;
    private String email;
    private String soDienThoai;
    private String streetName;
    private String district;
    private String city;
    private String country;
    private String note;
}
