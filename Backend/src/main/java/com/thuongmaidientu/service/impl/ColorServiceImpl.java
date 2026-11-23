package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.MauSacMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.MauSacDTO;
import com.thuongmaidientu.entity.CategoryEntity;
import com.thuongmaidientu.entity.MauSacEntity;
import com.thuongmaidientu.repository.ColorRepository;
import com.thuongmaidientu.service.ColorService;

@Service
public class ColorServiceImpl implements ColorService {
	@Autowired
	private MauSacMapper mauSacMapper;

	@Autowired
	private ColorRepository colorRepository;

	@Override
	public List<MauSacDTO> findAll(Pageable pageable) {
		List<MauSacEntity> entities = colorRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<MauSacDTO> selectAll() {
		List<MauSacEntity> entities = colorRepository.findByTrash("active");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private MauSacDTO convertToDTO(MauSacEntity entity) {
		MauSacDTO dto = mauSacMapper.toDTO(entity);
		if (dto != null) {
			dto.setNum_trash(getTotalItemTrash());
		}
		return dto;
	}

	public MauSacEntity convertToEntity(MauSacDTO dto) {
		return mauSacMapper.toEntity(dto);
	}

	@Override
	public void updateStatus(int id, int status) {
		colorRepository.updateStatusById(id, status);
	}

	@Override
	public void updateTrash(int id, String trash) {
		colorRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		colorRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public MauSacDTO findById(int masp) {
		Optional<MauSacEntity> entity = colorRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) colorRepository.count();
		int numTrash = (int) colorRepository.countByTrash("disable");

		return (int) (numTotal - numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) colorRepository.countByTrash("disable");
	}

	@Override
	public MauSacDTO save(MauSacDTO ncc) {
		MauSacEntity entity = convertToEntity(ncc);
		MauSacEntity savedEntity = colorRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public int getIdByValue(String color) {
		return colorRepository.selectIdByValue(color);
	}

	@Override
	public boolean checkNewValue(String value) {
		return colorRepository.existsByTenMauSac(value);
	}

	@Override
	public List<MauSacDTO> findTrash() {
		List<MauSacEntity> entities = colorRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
}
