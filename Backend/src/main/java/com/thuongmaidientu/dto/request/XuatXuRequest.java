package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XuatXuRequest {
    private Integer maXuatXu;
    private String tenXuatXu;
    private Integer status;
    private String trash;
    private java.util.Date deleteAt;
}
