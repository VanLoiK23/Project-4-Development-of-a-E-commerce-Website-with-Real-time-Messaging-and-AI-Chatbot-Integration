package com.thuongmaidientu.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemFeatureResponse {
	private Integer idSp;
	private String aspect;
	private String config;
	private Float score;
	private String source;
	private Float specScore;
	private Float absaScore;
	private Boolean flagSeeding;
	private Date updatedAt;
}