package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ChiTietPhieuXuatMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ChiTietPhieuXuatDTO;
import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.PhieuXuatDTO;
import com.thuongmaidientu.entity.ChiTietPhieuNhapEntity;
import com.thuongmaidientu.entity.ChiTietPhieuXuatEntity;
import com.thuongmaidientu.entity.ChiTietPhieuXuatKey;
import com.thuongmaidientu.entity.PhienBanSanPhamEntity;
import com.thuongmaidientu.entity.PhieuNhapEntity;
import com.thuongmaidientu.entity.PhieuXuatEntity;
import com.thuongmaidientu.repository.ChitietPXRepository;
import com.thuongmaidientu.repository.PhieuXuatRepository;
import com.thuongmaidientu.service.ChiTietPXService;

@Service
public class ChitietPXServiceImpl implements ChiTietPXService{
	@Autowired
	private ChiTietPhieuXuatMapper chiTietPhieuXuatMapper;


	@Autowired
	private ChitietPXRepository chitietPXRepository;
	
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
	public void saveCTPX(ChiTietPhieuXuatDTO px) {
		chitietPXRepository.save(convertToEntity(px));		
	}

	@Override
	public List<ChiTietPhieuXuatDTO> getListCTPX(Integer id) {
		List<ChiTietPhieuXuatEntity> entities = chitietPXRepository.getListCTPX(id);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
	
	public ChiTietPhieuXuatEntity convertToEntity(ChiTietPhieuXuatDTO dto) {
		ChiTietPhieuXuatEntity entity = chiTietPhieuXuatMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		ChiTietPhieuXuatKey key = new ChiTietPhieuXuatKey();
		Optional.ofNullable(dto.getPhieuXuatId()).ifPresent(id -> {
			PhieuXuatDTO r = phieuXuatService.findById(id.intValue());
			if (r != null) {
				key.setMaphieuxuat(id);
			} else {
				throw new IllegalArgumentException("PhieuXuatDTO không tồn tại");
			}
		});
		Optional.ofNullable(dto.getPhienBanSanPhamXuatId()).ifPresent(id -> {
			PhienBanSanPhamEntity pBanSanPhamEntity = new PhienBanSanPhamEntity();
			pBanSanPhamEntity.setMaPhienBanSP(id);
			entity.setPhienBanSanPhamXuat(pBanSanPhamEntity);
			key.setMaPhienBanSP(id);
		});
		entity.setId(key);

		return entity;
	}
	
	public ChiTietPhieuXuatDTO convertToDTO(ChiTietPhieuXuatEntity entity) {
		return chiTietPhieuXuatMapper.toDTO(entity);
	}

	@Override
	public void deletePX(Integer maPB) {

		PhienBanSanPhamEntity phienBanSanPhamEntity = new PhienBanSanPhamEntity();
		phienBanSanPhamEntity.setMaPhienBanSP(maPB);
		List<ChiTietPhieuXuatEntity> chiTietPhieuXuatEntities = chitietPXRepository.getByPhienBanSanPhamXuat(phienBanSanPhamEntity);

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
