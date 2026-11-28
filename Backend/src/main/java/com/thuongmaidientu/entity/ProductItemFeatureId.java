package com.thuongmaidientu.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductItemFeatureId implements Serializable {

	@Column(name = "id_sp")
	private Integer idSp;

	@Column(name = "aspect", length = 32)
	private String aspect;

	@Column(name = "config", length = 64)
	private String config;
}