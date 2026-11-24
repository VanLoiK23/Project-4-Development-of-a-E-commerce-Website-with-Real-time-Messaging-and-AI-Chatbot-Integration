package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColorRequest {
    private Integer maMauSac;
    private String tenMauSac;
    private Integer status;
    private String trash;
    private java.util.Date deletedAt;
}
