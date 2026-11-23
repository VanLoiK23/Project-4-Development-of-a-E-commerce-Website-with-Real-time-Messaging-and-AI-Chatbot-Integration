package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer maThuongHieu;
    private String tenThuongHieu;
    private String image;
    private Integer status;
    private String trash;
    private java.util.Date deleteAt;
}
