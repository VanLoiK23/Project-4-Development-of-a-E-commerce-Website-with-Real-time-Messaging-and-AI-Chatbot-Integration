package com.thuongmaidientu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.thuongmaidientu.entity.CTPhieuXuat;
import com.thuongmaidientu.entity.CTPhieuXuatKey;
import com.thuongmaidientu.entity.ProductVariantEntity;
import com.thuongmaidientu.entity.PhieuXuatEntity;

public interface CTPhieuXuatRepository extends JpaRepository<CTPhieuXuat,CTPhieuXuatKey> {
	@Modifying
	@Transactional
	@Query(value="DELETE FROM chitietphieuxuat  WHERE maphienbansp = :maPhienBanSP",nativeQuery = true)
	void deleteByMaPhienBanSP(@Param("maPhienBanSP") Integer maPhienBanSP);
	
	
	@Query(value="SELECT COALESCE(SUM(soluong), 0) FROM chitietphieuxuat WHERE maphienbansp = :ma",nativeQuery = true)
	Integer countSLSOLD(@Param("ma") Integer maPB);
	
	@Query(value = "SELECT COALESCE(SUM(soluong), 0) FROM chitietphieuxuat WHERE maphienbansp = :ma AND maphieuxuat=:pn", nativeQuery = true)
	Integer countSLXuatByMaPBANDMaPN(@Param("ma") Integer maPB, @Param("pn") Integer maPN);
	
	@Query(value = "SELECT * FROM chitietphieuxuat WHERE maphieuxuat = :id", nativeQuery = true)
	List<CTPhieuXuat> getListCTPX(@Param("id") Integer id);
	
	@Modifying
	@Transactional
	void deleteByPhienBanSanPhamXuat(ProductVariantEntity phienBanSanPhamXuat);
	
	long countByPhieuXuat(PhieuXuatEntity phieuXuat);
	
	List<CTPhieuXuat> getByPhienBanSanPhamXuat(ProductVariantEntity phienBanSanPhamXuat);
}
