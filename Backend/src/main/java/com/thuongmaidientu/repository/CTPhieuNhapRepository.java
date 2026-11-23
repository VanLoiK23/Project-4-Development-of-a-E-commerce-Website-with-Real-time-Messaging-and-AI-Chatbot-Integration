package com.thuongmaidientu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.thuongmaidientu.entity.CTPhieuNhap;
import com.thuongmaidientu.entity.CTPhieuNhapKey;
import com.thuongmaidientu.entity.ProductVariantEntity;
import com.thuongmaidientu.entity.PhieuNhapEntity;

public interface CTPhieuNhapRepository extends JpaRepository<CTPhieuNhap, CTPhieuNhapKey> {

	@Modifying
	@Transactional
	@Query(value = "DELETE FROM chitietphieunhap  WHERE maphienbansp = :maPhienBanSP", nativeQuery = true)
	void deleteByMaPhienBanSP(@Param("maPhienBanSP") Integer maPhienBanSP);

	@Query(value = "SELECT COALESCE(SUM(soluong), 0) FROM chitietphieunhap WHERE maphienbansp = :ma", nativeQuery = true)
	Integer countSLNhap(@Param("ma") Integer maPB);

	@Query(value = "SELECT COALESCE(SUM(soluong), 0) FROM chitietphieunhap WHERE maphienbansp = :ma AND maphieunhap=:pn", nativeQuery = true)
	Integer countSLNhapByMaPBANDMaPN(@Param("ma") Integer maPB, @Param("pn") Integer maPN);
	
	@Query(value = "SELECT * FROM chitietphieunhap WHERE maphieunhap = :id", nativeQuery = true)
	List<CTPhieuNhap> getListCTPN(@Param("id") Integer id);
	
	@Modifying
	@Transactional
	void deleteByPhienBanSanPhamNhap(ProductVariantEntity phienBanSanPhamNhap);
	
	long countByPhieunhap(PhieuNhapEntity phieunhap);
	
	List<CTPhieuNhap> getByPhienBanSanPhamNhap(ProductVariantEntity phienBanSanPhamNhap);
}
