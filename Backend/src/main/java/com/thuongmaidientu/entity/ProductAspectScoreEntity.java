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
@Table(name = "product_aspect_score")
@Getter
@Setter
@NoArgsConstructor
public class ProductAspectScoreEntity {

    @EmbeddedId
    private ProductAspectScoreId id = new ProductAspectScoreId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idSp")
    @JoinColumn(name = "id_sp", nullable = false)
    private ProductEntity product;

    @Column(name = "n_reviews")
    private Integer nReviews;

    @Column(name = "n_mentions")
    private Integer nMentions;

    @Column(name = "n_pos")
    private Integer nPos;

    @Column(name = "n_neu")
    private Integer nNeu;

    @Column(name = "n_neg")
    private Integer nNeg;

    @Column(name = "raw_score")
    private Float rawScore;

    @Column(name = "smooth_score")
    private Float smoothScore;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}