package com.thuongmaidientu.entity;

import java.util.Date;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "comment_and_rate")
@Getter
@Setter
@NoArgsConstructor
public class CommentProductEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "external_review_id", length = 120)
	private String externalReviewId;

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content = "";

	@Column(name = "rate", nullable = false)
	private Double rate = 0.0;

	@Column(name = "img", nullable = false, length = 255)
	private String img = "";

	@Column(name = "has_media", nullable = false)
	private Integer hasMedia = 0;

	@Column(name = "helpful_count", nullable = false)
	private Integer helpfulCount = 0;

	@Column(name = "variant_label", length = 255)
	private String variantLabel;

	@Column(name = "user_hash", length = 128)
	private String userHash;

	@Column(name = "verified", nullable = false)
	private Integer verified = 0;

	@Column(name = "source", length = 100)
	private String source;

	@Column(name = "scraped_at")
	@Temporal(TemporalType.TIMESTAMP)
	private Date scrapedAt;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "absa_aspects", columnDefinition = "jsonb")
	private Object absaAspects;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_user", nullable = true)
	private KhachHangEntity user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_sp", nullable = false)
	private ProductEntity product;

	@Column(name = "feeback", nullable = false)
	private Integer feedback = 0;

	@Column(name = "feeback_content", length = 255)
	private String feedbackContent;

	@Column(name = "nhanvien", length = 255)
	private String nhanVien;

	@Column(name = "ngayphanhoi")
	@Temporal(TemporalType.TIMESTAMP)
	private Date ngayPhanHoi;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id", nullable = true)
	private PhieuXuatEntity order;

	@Column(name = "ngay_danhgia", nullable = false)
	@Temporal(TemporalType.DATE)
	private Date ngayDanhGia;

}
