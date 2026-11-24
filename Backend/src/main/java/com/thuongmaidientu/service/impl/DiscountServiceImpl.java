package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.DiscountMapper;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.DiscountDTO;
import com.thuongmaidientu.entity.DiscountEntity;
import com.thuongmaidientu.repository.DiscountRepository;
import com.thuongmaidientu.service.DiscountService;

@Service
public class DiscountServiceImpl implements DiscountService {
	@Autowired
	private DiscountMapper discountMapper;

	@Autowired
	private DiscountRepository DiscountRepository;

	@Override
	public List<DiscountDTO> findAll(Pageable pageable) {
		List<DiscountEntity> entities = DiscountRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<DiscountDTO> selectAll() {
		List<DiscountEntity> entities = DiscountRepository.findByTrash("active");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private DiscountDTO convertToDTO(DiscountEntity entity) {
		DiscountDTO dto = discountMapper.toDTO(entity);
		if (dto != null && entity.getCreated() != null) {
			dto.setCreatedDate(entity.getCreated());
		}
		return dto;
	}

	public DiscountEntity convertToEntity(DiscountDTO dto) {
		DiscountEntity entity = discountMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}
		if (entity.getCreated() == null) {
			entity.setCreated(new Date());
		}
		return entity;
	}

	@Override
	public void updateStatus(int id, int status) {
		DiscountRepository.updateStatusById(id, status);
	}

	@Override
	public void updateTrash(int id, String trash) {
		DiscountRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		DiscountRepository.deleteById((id));
	}

	@Override
	public DiscountDTO findById(int masp) {
		Optional<DiscountEntity> entity = DiscountRepository.findById(masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) DiscountRepository.count();
		int numTrash = (int) DiscountRepository.countByTrash("disable");

		return (int) (numTotal - numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) DiscountRepository.countByTrash("disable");
	}

	@Override
	public DiscountDTO save(DiscountDTO ncc) {
		DiscountEntity entity = convertToEntity(ncc);
		DiscountEntity savedEntity = DiscountRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public boolean checkNewCode(String value) {
		return DiscountRepository.existsByCodeAllIgnoreCase(value);
	}

	@Override
	public List<DiscountDTO> findTrash() {
		List<DiscountEntity> entities = DiscountRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public void decrese(int id) {
		DiscountRepository.decrese(id);
	}
}
