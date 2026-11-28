package com.thuongmaidientu.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sanpham")
public class ProductEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "masp")
	private Integer id;

	@Column(name = "tensp", length = 255)
	private String tenSanPham;

	@Column(name = "alias", length = 255, nullable = false)
	private String alias;

	@Column(name = "hinhanh", length = 500)
	private String hinhAnh;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "xuatxu")
	private XuatXuEntity xuatXu;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "thuonghieu")
	private CategoryEntity thuongHieu;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "khuvuckho")
	private KhuVucKhoEntity khuVucKho;

	@Column(name = "soluongnhap")
	private Integer soLuongNhap = 0;

	@Column(name = "soluongban")
	private Integer soLuongBan = 0;

	@Column(name = "promo", columnDefinition = "TEXT")
	private String promo;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "collections", columnDefinition = "jsonb", nullable = false)
	private List<String> collections = new ArrayList<>();

	@Column(name = "sort_desc", length = 10000, nullable = false)
	private String sortDesc = "";

	@Column(name = "detail", columnDefinition = "TEXT", nullable = false)
	private String detail = "";

	@Column(name = "tongsao")
	private Double tongSao = 0.0;

	@Column(name = "soluongdanhgia")
	private Integer soLuongDanhGia = 0;

	@Column(name = "created", nullable = false, updatable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date created;

	@Column(name = "created_by", length = 100, nullable = false, updatable = false)
	private String createdBy = "importer";

	@Column(name = "modified", nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date modified;

	@Column(name = "modified_by", length = 100, nullable = false)
	private String modifiedBy = "importer";

	@Column(name = "trash", length = 10, nullable = false)
	private String trash = "active";

	@Column(name = "deleted_at")
	@Temporal(TemporalType.DATE)
	private Date deletedAt;

	@Column(name = "status", nullable = false)
	private Integer status = 1;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "specs", columnDefinition = "jsonb")
	private Map<String, Object> specs = new HashMap<>();

	@OneToMany(mappedBy = "sanPham")
	private List<ProductVariantEntity> listPhienBanSP = new ArrayList<>();

	@OneToMany(mappedBy = "product")
	private List<CommentProductEntity> listcomment = new ArrayList<>();

	@Transient
	private Integer xxID;

	@Transient
	private Integer khoID;

	@Transient
	private Integer thuonghieuID;

}
