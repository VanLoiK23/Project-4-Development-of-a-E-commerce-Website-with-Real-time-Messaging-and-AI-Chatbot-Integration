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
public class ProductAspectScoreResponse {
	private Integer idSp;
	private String aspect;
	private String modelVersion;
	private Integer nReviews;
	private Integer nMentions;
	private Integer nPos;
	private Integer nNeu;
	private Integer nNeg;
	private Float rawScore;
	private Float smoothScore;
	private Date updatedAt;
}