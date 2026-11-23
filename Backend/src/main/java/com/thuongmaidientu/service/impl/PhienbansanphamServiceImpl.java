package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ProductVariantMapper;
import com.thuongmaidientu.mapper.RamMapper;
import com.thuongmaidientu.mapper.RomMapper;
import com.thuongmaidientu.mapper.ColorMapper;
import com.thuongmaidientu.mapper.ProductMapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ColorDTO;
import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.dto.RamDTO;
import com.thuongmaidientu.dto.RomDTO;
import com.thuongmaidientu.entity.ProductVariantEntity;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.repository.ProductVariantRepository;
import com.thuongmaidientu.repository.ProductRepository;
import com.thuongmaidientu.service.ColorService;
import com.thuongmaidientu.service.ProductVariantService;
import com.thuongmaidientu.service.RamService;
import com.thuongmaidientu.service.RomService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PhienbansanphamServiceImpl implements ProductVariantService {
	private final ProductVariantMapper phienBanSanPhamMapper;

	private final ProductVariantRepository phienbanSPRepository;

	private final ColorService colorRepository;

	private final RamService ramRepository;

	private final RomService romRepository;

	private final ProductRepository productRepository;

	private final ProductMapper productMapper;

	private final ColorMapper colorMapper;

	private final RamMapper ramMapper;

	private final RomMapper romMapper;

	public PhienBanSanPhamDTO convertToDTO(ProductVariantEntity entity) {
		return phienBanSanPhamMapper.toDTO(entity);
	}

	// Convert DTO -> Entity
	public ProductVariantEntity convertToEntity(PhienBanSanPhamDTO dto) {
		ProductVariantEntity entity = phienBanSanPhamMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		Optional.ofNullable(dto.getMaSanpham()).ifPresent(id -> {
			Optional<ProductEntity> product = productRepository.findById(id);
			entity.setSanPham(product.get());
		});
		Optional.ofNullable(dto.getColorId()).ifPresent(id -> {
			ColorDTO c = colorRepository.findById(id.intValue());
			if (c != null) {
				entity.setMauSac(colorMapper.toEntity(c));
			}
		});
		Optional.ofNullable(dto.getRamId()).ifPresent(id -> {
			RamDTO r = ramRepository.findById(id.intValue());
			if (r != null) {
				entity.setRam(ramMapper.toEntity(r));
			}
		});
		Optional.ofNullable(dto.getRomId()).ifPresent(id -> {
			RomDTO r = romRepository.findById(id.intValue());
			if (r != null) {
				entity.setRom(romMapper.toEntity(r));
			}
		});

		return entity;
	}

	@Override
	public PhienBanSanPhamDTO save(PhienBanSanPhamDTO phienbanmoi) {
		// Chuyển DTO thành entity
		ProductVariantEntity entity = convertToEntity(phienbanmoi);
		ProductVariantEntity savedEntity = phienbanSPRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public void delete(Long mapbsp) {

		phienbanSPRepository.deleteById(mapbsp);
	}

	@Override
	public List<Integer> selectAllMaPBSPByMaSP(int masp) {
		return phienbanSPRepository.selectAllMaphienbanSPByMaSP(masp);
	}

	@Override
	public Long findVariantId(PhienBanSanPhamDTO variant, Long masp) {
		return phienbanSPRepository.findVariantId(masp, variant.getRomId(), variant.getRamId(), variant.getColorId());
	}

	@Override
	public Integer countProductCon(Integer masp) {
		return phienbanSPRepository.countNumberByMaPhienBanSP(masp);
	}

	@Override
	public void update(PhienBanSanPhamDTO pb) {

		phienbanSPRepository.updatePBSP(pb.getMaPhienbansanpham(), pb.getRomId(), pb.getRamId(), pb.getColorId(),
				pb.getGiaNhap(), pb.getGiaXuat(), pb.getSale(), pb.getPriceSale());

	}

	@Override
	public void updateSL(Integer mapb, Integer sl) {
		phienbanSPRepository.updateSLPBSP(Long.valueOf(mapb), sl);
	}

	@Override
	public Integer findMaSP(Integer mapb) {
		return phienbanSPRepository.findMaSP(mapb);
	}

	@Override
	public PhienBanSanPhamDTO findById(int id) {
		Optional<ProductVariantEntity> entity = phienbanSPRepository.findById(Long.valueOf(id));
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public void deletePhienBanSP(Integer maPB) {
		phienbanSPRepository.deleteById(Long.valueOf(maPB));
	}

	@Override
	public Long findIdVersionByConfig(Integer masp, Integer ram, Integer rom, String color) {
		return phienbanSPRepository.findVariantId(masp, ram, rom, color);
	}

	@Override
	public void setUpQuantity(Integer mapb, Integer sl) {
		phienbanSPRepository.setUpSLPBSP(Long.valueOf(mapb), sl);
	}

}
