package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.NhanVienMapper;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.NhanVienDTO;
import com.thuongmaidientu.entity.NhanVienEntity;
import com.thuongmaidientu.repository.NhanvienRepository;
import com.thuongmaidientu.service.NhanvienService;

@Service
public class NhanvienServiceImpl implements NhanvienService {
	@Autowired
	private NhanVienMapper nhanVienMapper;


	@Autowired
	private NhanvienRepository nhanvienRepository;

	@Override
	public NhanVienDTO findById(int id) {
		Optional<NhanVienEntity> entity = nhanvienRepository.findById(id);
		return entity.map(this::convertToDTO).orElse(null);
	}

	private NhanVienDTO convertToDTO(NhanVienEntity entity) {
		return nhanVienMapper.toDTO(entity);
	}
	
	public NhanVienEntity convertToEntity(NhanVienDTO dto) {
		return nhanVienMapper.toEntity(dto);
	}

}
