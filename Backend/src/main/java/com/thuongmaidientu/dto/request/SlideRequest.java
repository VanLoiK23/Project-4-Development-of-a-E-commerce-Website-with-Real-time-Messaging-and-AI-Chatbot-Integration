package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlideRequest {
    private Integer id;
    private String image;
    private String trash;
    private Integer status;
    private java.util.Date deletedAt;
}
