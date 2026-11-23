package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NhaCungCapRequest {
    private Integer id;
    private String tenNhaCungCap;
    private String diaChi;
    private String email;
    private String soDienThoai;
    private Integer status;
    private String trash;
    private java.util.Date deleteAt;
}
