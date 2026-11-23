package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ChiTietPhieuNhapMapper;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ChiTietPhieuNhapDTO;
import com.thuongmaidientu.dto.NhaCungCapDTO;
import com.thuongmaidientu.dto.NhanVienDTO;
import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.PhieuNhapDTO;
import com.thuongmaidientu.dto.RomDTO;
import com.thuongmaidientu.entity.CartEntity;
import com.thuongmaidientu.entity.CartItemEntity;
import com.thuongmaidientu.entity.ChiTietPhieuNhapEntity;
import com.thuongmaidientu.entity.ChiTietPhieuNhapKey;
import com.thuongmaidientu.entity.MauSacEntity;
import com.thuongmaidientu.entity.PhienBanSanPhamEntity;
import com.thuongmaidientu.entity.PhieuNhapEntity;
import com.thuongmaidientu.repository.ChitietPNRepository;
import com.thuongmaidientu.repository.PhieuNhapRepository;
import com.thuongmaidientu.service.ChiTietPNService;

@Service
public class ChitietPNServiceImpl implements ChiTietPNService {
	@Autowired
	private ChiTietPhieuNhapMapper chiTietPhieuNhapMapper;


	@Autowired
	private ChitietPNRepository chitietPNRepository;
	
	@Autowired
	private PhieuNhapRepository phieuNhapRepository;

	@Autowired
	private PhieuNhapServiceImpl phieuNhapService;

	@Autowired
	private PhienbansanphamServiceImpl phienbansanphamService;

	@Override
	public void delete(Long mapb) {
		chitietPNRepository.deleteByMaPhienBanSP(mapb.intValue());
	}

	@Override
	public Integer countNumberProductNhap(Integer mapb) {
		return chitietPNRepository.countSLNhap(mapb);
	}

	@Override
	public void saveCTPN(ChiTietPhieuNhapDTO pn) {
		chitietPNRepository.save(convertToEntity(pn));
	}

	public ChiTietPhieuNhapEntity convertToEntity(ChiTietPhieuNhapDTO dto) {
		ChiTietPhieuNhapEntity entity = chiTietPhieuNhapMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		ChiTietPhieuNhapKey key = new ChiTietPhieuNhapKey();
		Optional.ofNullable(dto.getPhieunhapId()).ifPresent(id -> {
			PhieuNhapDTO r = phieuNhapService.findById(id.intValue());
			if (r != null) {
				key.setMaPhieuNhap(id);
			} else {
				throw new IllegalArgumentException("PhieuNhapDTO không tồn tại");
			}
		});
		Optional.ofNullable(dto.getPhienBanSanPhamNhapId()).ifPresent(id -> {
			PhienBanSanPhamDTO pn = phienbansanphamService.findById(id.intValue());
			entity.setPhienBanSanPhamNhap(phienbansanphamService.convertToEntity(pn));
			key.setMaPhienBanSP(id);
		});
		entity.setId(key);

		return entity;
	}

	public ChiTietPhieuNhapDTO convertToDTO(ChiTietPhieuNhapEntity entity) {
		return chiTietPhieuNhapMapper.toDTO(entity);
	}

	
	@Override
	public Integer countNumberProductNhapANDMaPBSP(Integer mapb, Integer mapn) {
		return chitietPNRepository.countSLNhapByMaPBANDMaPN(mapb, mapn);
	}

	@Override
	public List<ChiTietPhieuNhapDTO> getListCTPN(Integer id) {
		List<ChiTietPhieuNhapEntity> entities = chitietPNRepository.getListCTPN(id);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public void deletePN(Integer maPB) {
		PhienBanSanPhamEntity phienBanSanPhamEntity = new PhienBanSanPhamEntity();
		phienBanSanPhamEntity.setMaPhienBanSP(maPB);
		List<ChiTietPhieuNhapEntity> chiTietPhieuNhapEntities = chitietPNRepository.getByPhienBanSanPhamNhap(phienBanSanPhamEntity);

		chiTietPhieuNhapEntities.forEach(ct -> {

			chitietPNRepository.deleteByPhienBanSanPhamNhap(phienBanSanPhamEntity);
			
			PhieuNhapEntity phieuNhapEntity=new PhieuNhapEntity();
			phieuNhapEntity.setId(ct.getPhieunhap().getId());
			
			if(chitietPNRepository.countByPhieunhap(phieuNhapEntity)==0) {
				phieuNhapRepository.delete(phieuNhapEntity);
			}
		});
	}

}
