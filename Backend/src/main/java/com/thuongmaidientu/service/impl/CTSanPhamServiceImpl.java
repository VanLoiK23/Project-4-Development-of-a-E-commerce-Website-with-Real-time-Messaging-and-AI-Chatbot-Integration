package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.CTSanPhamMapper;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.CTSanPhamDTO;
import com.thuongmaidientu.entity.CTSanPhamEntity;
import com.thuongmaidientu.entity.ProductVariantEntity;
import com.thuongmaidientu.entity.PhieuNhapEntity;
import com.thuongmaidientu.entity.PhieuXuatEntity;
import com.thuongmaidientu.repository.CTSanPhamRepository;
import com.thuongmaidientu.service.CTSanPhamService;

@Service
public class CTSanPhamServiceImpl implements CTSanPhamService {
	@Autowired
	private CTSanPhamMapper ctSanPhamMapper;

	@Autowired
	private CTSanPhamRepository chiTietSPRepository;

	@Override
	public void delete(Long mapb) {
		chiTietSPRepository.deleteByMaPhienBanSP(mapb.intValue());
	}

	@Override
	public void save(CTSanPhamDTO ct) {
		chiTietSPRepository.save(convertToEntity(ct));
	}

	public CTSanPhamEntity convertToEntity(CTSanPhamDTO dto) {
		CTSanPhamEntity entity = ctSanPhamMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		Optional.ofNullable(dto.getProductVersionId()).ifPresent(id -> {
			ProductVariantEntity pn = new ProductVariantEntity();
			pn.setMaPhienBanSP(id);
			entity.setProductVersion(pn);
		});

		if (dto.getPnId() != null) {
			PhieuNhapEntity pNhapEntity = new PhieuNhapEntity();
			pNhapEntity.setId(dto.getPnId());
			entity.setPn(pNhapEntity);
		}

		Optional.ofNullable(dto.getPxId()).ifPresent(id -> {
			PhieuXuatEntity pn = new PhieuXuatEntity();
			pn.setId(id);
			entity.setPx(pn);
		});

		Optional.ofNullable(dto.getTinhTrang()).ifPresent(id -> {
			entity.setTinhTrang(id);
		});

		return entity;
	}

	@Override
	public List<Long> selectListImei(Integer mapb, Pageable page) {
		return chiTietSPRepository.findImeisByPhienBan(mapb, page);
	}

	@Override
	public List<Long> selectListImeiForCancle(Integer orderId, Integer mapb) {
		return chiTietSPRepository.findImeisByPhienBanForCancle(orderId, mapb);
	}
	
	@Override
	public void updateCTSP(int mapx, int mapb, Long imei) {
		chiTietSPRepository.updateCTSP(mapx, mapb, imei);
	}

	@Override
	public void updateCTSPForCancle(int mapx, int mapb, Long imei) {
		chiTietSPRepository.updateCTSPForCancle(mapx, mapb, imei);
	}

	
	@Override
	public void deleteCTSP(Integer maPB) {		
		chiTietSPRepository.deleteByMaPhienBanSP(maPB);
	}

	@Override
	public Integer getQuantityVersionProduct(Integer masp, Integer maPBSP) {
		return chiTietSPRepository.getQuantityVersionProductInStock(masp, maPBSP);
	}

	@Override
	public Integer getQuantityProductByStatus(Integer masp, Integer status) {
		return chiTietSPRepository.getQuantityProductByStatus(masp, status);
	}


}
