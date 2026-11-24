package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ColorMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ColorDTO;
import com.thuongmaidientu.entity.CategoryEntity;
import com.thuongmaidientu.entity.ColorEntity;
import com.thuongmaidientu.repository.ColorRepository;
import com.thuongmaidientu.service.ColorService;

@Service
public class ColorServiceImpl implements ColorService {
	@Autowired
	private ColorMapper mauSacMapper;

	@Autowired
	private ColorRepository colorRepository;

	@Override
	public List<ColorDTO> findAll(Pageable pageable) {
		List<ColorEntity> entities = colorRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ColorDTO> selectAll() {
		List<ColorEntity> entities = colorRepository.findByTrash("active");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private ColorDTO convertToDTO(ColorEntity entity) {
		ColorDTO dto = mauSacMapper.toDTO(entity);
		if (dto != null) {
			dto.setNum_trash(getTotalItemTrash());
		}
		return dto;
	}

	public ColorEntity convertToEntity(ColorDTO dto) {
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
	public ColorDTO findById(int masp) {
		Optional<ColorEntity> entity = colorRepository.findById((long) masp);
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
	public ColorDTO save(ColorDTO ncc) {
		ColorEntity entity = convertToEntity(ncc);
		ColorEntity savedEntity = colorRepository.save(entity);
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
	public List<ColorDTO> findTrash() {
		List<ColorEntity> entities = colorRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
}
