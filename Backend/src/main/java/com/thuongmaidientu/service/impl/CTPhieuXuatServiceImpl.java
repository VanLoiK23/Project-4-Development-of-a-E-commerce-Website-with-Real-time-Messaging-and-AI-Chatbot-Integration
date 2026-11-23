package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.CTPhieuXuatMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.CTPhieuXuatDTO;
import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.PhieuXuatDTO;
import com.thuongmaidientu.entity.CTPhieuNhap;
import com.thuongmaidientu.entity.CTPhieuXuat;
import com.thuongmaidientu.entity.CTPhieuXuatKey;
import com.thuongmaidientu.entity.ProductVariantEntity;
import com.thuongmaidientu.entity.PhieuNhapEntity;
import com.thuongmaidientu.entity.PhieuXuatEntity;
import com.thuongmaidientu.repository.CTPhieuXuatRepository;
import com.thuongmaidientu.repository.PhieuXuatRepository;
import com.thuongmaidientu.service.CTPhieuXuatService;

@Service
public class CTPhieuXuatServiceImpl implements CTPhieuXuatService{
	@Autowired
	private CTPhieuXuatMapper chiTietPhieuXuatMapper;


	@Autowired
	private CTPhieuXuatRepository chitietPXRepository;
	
	@Autowired
	private PhieuXuatRepository phieuXuatRepository;
	
	@Autowired
	private PhieuXuatServiceImpl phieuXuatService;

	@Autowired
	private PhienbansanphamServiceImpl phienbansanphamService;

	
	@Override
	public void delete(Long mapb) {
		chitietPXRepository.deleteByMaPhienBanSP(mapb.intValue());
	}

	@Override
	public Integer countNumberProductSold(Integer mapb) {
		return chitietPXRepository.countSLSOLD(mapb);
	}

	@Override
	public Integer countNumberProductXuatANDMaPBSP(Integer mapb, Integer mapx) {
		return chitietPXRepository.countSLXuatByMaPBANDMaPN(mapb, mapx);
	}

	@Override
	public void saveCTPX(CTPhieuXuatDTO px) {
		chitietPXRepository.save(convertToEntity(px));		
	}

	@Override
	public List<CTPhieuXuatDTO> getListCTPX(Integer id) {
		List<CTPhieuXuat> entities = chitietPXRepository.getListCTPX(id);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
	
	public CTPhieuXuat convertToEntity(CTPhieuXuatDTO dto) {
		CTPhieuXuat entity = chiTietPhieuXuatMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		CTPhieuXuatKey key = new CTPhieuXuatKey();
		Optional.ofNullable(dto.getPhieuXuatId()).ifPresent(id -> {
			PhieuXuatDTO r = phieuXuatService.findById(id.intValue());
			if (r != null) {
				key.setMaphieuxuat(id);
			} else {
				throw new IllegalArgumentException("PhieuXuatDTO không tồn tại");
			}
		});
		Optional.ofNullable(dto.getPhienBanSanPhamXuatId()).ifPresent(id -> {
			ProductVariantEntity pBanSanPhamEntity = new ProductVariantEntity();
			pBanSanPhamEntity.setMaPhienBanSP(id);
			entity.setPhienBanSanPhamXuat(pBanSanPhamEntity);
			key.setMaPhienBanSP(id);
		});
		entity.setId(key);

		return entity;
	}
	
	public CTPhieuXuatDTO convertToDTO(CTPhieuXuat entity) {
		return chiTietPhieuXuatMapper.toDTO(entity);
	}

	@Override
	public void deletePX(Integer maPB) {

		ProductVariantEntity phienBanSanPhamEntity = new ProductVariantEntity();
		phienBanSanPhamEntity.setMaPhienBanSP(maPB);
		List<CTPhieuXuat> chiTietPhieuXuatEntities = chitietPXRepository.getByPhienBanSanPhamXuat(phienBanSanPhamEntity);

		chiTietPhieuXuatEntities.forEach(ct -> {

			chitietPXRepository.deleteByPhienBanSanPhamXuat(phienBanSanPhamEntity);
			
			PhieuXuatEntity phieuXuatEntity=new PhieuXuatEntity();
			phieuXuatEntity.setId(ct.getPhieuXuat().getId());
			
			if(chitietPXRepository.countByPhieuXuat(phieuXuatEntity)==0) {
				phieuXuatRepository.delete(phieuXuatEntity);
			}
		});
	}

}
