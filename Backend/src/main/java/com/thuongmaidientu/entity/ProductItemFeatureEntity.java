package com.thuongmaidientu.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_item_feature")
@Getter
@Setter
@NoArgsConstructor
public class ProductItemFeatureEntity {

	@EmbeddedId
	private ProductItemFeatureId id = new ProductItemFeatureId();

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("idSp")
	@JoinColumn(name = "id_sp", nullable = false)
	private ProductEntity product;

	@Column(name = "score")
	private Float score;

	@Column(name = "source", length = 20)
	private String source;

	@Column(name = "spec_score")
	private Float specScore;

	@Column(name = "absa_score")
	private Float absaScore;

	@Column(name = "flag_seeding", nullable = false)
	private Boolean flagSeeding = false;

	@Column(name = "updated_at")
	@Temporal(TemporalType.TIMESTAMP)
	private Date updatedAt;
}