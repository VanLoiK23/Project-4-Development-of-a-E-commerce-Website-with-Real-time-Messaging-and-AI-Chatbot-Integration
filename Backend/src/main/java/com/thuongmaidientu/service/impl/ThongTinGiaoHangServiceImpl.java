package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ThongTinGiaoHangMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.NhaCungCapDTO;
import com.thuongmaidientu.dto.ThongTinGiaoHangDTO;
import com.thuongmaidientu.entity.KhachHangEntity;
import com.thuongmaidientu.entity.NhaCungCapEntity;
import com.thuongmaidientu.entity.NhanVienEntity;
import com.thuongmaidientu.entity.RomEntity;
import com.thuongmaidientu.entity.ThongTinGiaoHangEntity;
import com.thuongmaidientu.repository.ThongTinGiaoHangRepository;
import com.thuongmaidientu.service.ThongTinGiaoHangService;

@Service
public class ThongTinGiaoHangServiceImpl implements ThongTinGiaoHangService {
	@Autowired
	private ThongTinGiaoHangMapper thongTinGiaoHangMapper;


	@Autowired
	private ThongTinGiaoHangRepository thongTinGiaoHangRepository;

	@Autowired
	private KhachHangServiceImpl khachHangService;

	@Override
	public List<ThongTinGiaoHangDTO> getAllByIdkh(Integer idkh) {
		KhachHangEntity khEntity=khachHangService.convertToEntity(khachHangService.findById(idkh));
		
		List<ThongTinGiaoHangEntity> entities = thongTinGiaoHangRepository.findByKhachHangDat(khEntity);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private ThongTinGiaoHangDTO convertToDTO(ThongTinGiaoHangEntity entity) {
		return thongTinGiaoHangMapper.toDTO(entity);
	}

	public ThongTinGiaoHangEntity convertToEntity(ThongTinGiaoHangDTO dto) {
		ThongTinGiaoHangEntity entity = thongTinGiaoHangMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		if (dto.getIdkh() != null && khachHangService.findById(dto.getIdkh()) != null) {
			KhachHangEntity khEntity = khachHangService.convertToEntity(khachHangService.findById(dto.getIdkh()));
			entity.setKhachHangDat(khEntity);
		}

		return entity;
	}

	@Override
	public ThongTinGiaoHangDTO insertAddress(ThongTinGiaoHangDTO address) {
		ThongTinGiaoHangEntity entity = convertToEntity(address);
		ThongTinGiaoHangEntity savedEntity = thongTinGiaoHangRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public boolean deleteAddress(Integer id) {
		thongTinGiaoHangRepository.deleteById(Long.valueOf(id));
		return true;
	}

	@Override
	public ThongTinGiaoHangDTO findById(Integer id) {
		Optional<ThongTinGiaoHangEntity> entity = thongTinGiaoHangRepository.findById((long) id);
	    return entity.map(this::convertToDTO).orElse(null); 
	}

}
