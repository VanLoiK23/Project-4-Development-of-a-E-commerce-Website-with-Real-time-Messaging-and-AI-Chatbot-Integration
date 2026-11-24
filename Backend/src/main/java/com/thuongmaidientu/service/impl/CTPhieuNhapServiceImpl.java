package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.CTPhieuNhapMapper;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.CTPhieuNhapDTO;
import com.thuongmaidientu.dto.NhaCungCapDTO;
import com.thuongmaidientu.dto.NhanVienDTO;
import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.PhieuNhapDTO;
import com.thuongmaidientu.dto.RomDTO;
import com.thuongmaidientu.entity.CartEntity;
import com.thuongmaidientu.entity.CartItemEntity;
import com.thuongmaidientu.entity.CTPhieuNhap;
import com.thuongmaidientu.entity.CTPhieuNhapKey;
import com.thuongmaidientu.entity.ColorEntity;
import com.thuongmaidientu.entity.ProductVariantEntity;
import com.thuongmaidientu.entity.PhieuNhapEntity;
import com.thuongmaidientu.repository.CTPhieuNhapRepository;
import com.thuongmaidientu.repository.PhieuNhapRepository;
import com.thuongmaidientu.service.CTPhieuNhapService;

@Service
public class CTPhieuNhapServiceImpl implements CTPhieuNhapService {
	@Autowired
	private CTPhieuNhapMapper chiTietPhieuNhapMapper;


	@Autowired
	private CTPhieuNhapRepository chitietPNRepository;
	
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
	public void saveCTPN(CTPhieuNhapDTO pn) {
		chitietPNRepository.save(convertToEntity(pn));
	}

	public CTPhieuNhap convertToEntity(CTPhieuNhapDTO dto) {
		CTPhieuNhap entity = chiTietPhieuNhapMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		CTPhieuNhapKey key = new CTPhieuNhapKey();
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

	public CTPhieuNhapDTO convertToDTO(CTPhieuNhap entity) {
		return chiTietPhieuNhapMapper.toDTO(entity);
	}

	
	@Override
	public Integer countNumberProductNhapANDMaPBSP(Integer mapb, Integer mapn) {
		return chitietPNRepository.countSLNhapByMaPBANDMaPN(mapb, mapn);
	}

	@Override
	public List<CTPhieuNhapDTO> getListCTPN(Integer id) {
		List<CTPhieuNhap> entities = chitietPNRepository.getListCTPN(id);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public void deletePN(Integer maPB) {
		ProductVariantEntity phienBanSanPhamEntity = new ProductVariantEntity();
		phienBanSanPhamEntity.setMaPhienBanSP(maPB);
		List<CTPhieuNhap> chiTietPhieuNhapEntities = chitietPNRepository.getByPhienBanSanPhamNhap(phienBanSanPhamEntity);

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
