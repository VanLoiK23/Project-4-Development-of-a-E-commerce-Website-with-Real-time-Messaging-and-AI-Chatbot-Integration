package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.SlideMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.SlideDTO;
import com.thuongmaidientu.dto.response.SlideResponse;
import com.thuongmaidientu.entity.SlideEntity;
import com.thuongmaidientu.repository.SlideRepository;
import com.thuongmaidientu.service.SlideService;

@Service
public class SlideServiceImpl implements SlideService {
	@Autowired
	private SlideMapper slideMapper;

	@Autowired
	private SlideRepository SlideRepository;

	@Override
	public List<SlideDTO> findAll(Pageable pageable) {
		List<SlideEntity> entities = SlideRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<SlideResponse> fetchSlides() {
		List<SlideEntity> entities = SlideRepository.findAll();
		return entities.stream().map(slideMapper::toResponse).collect(Collectors.toList());
	}

	@Override
	public List<SlideDTO> selectAll() {
		List<SlideEntity> entities = SlideRepository.findAll();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private SlideDTO convertToDTO(SlideEntity entity) {
		return slideMapper.toDTO(entity);
	}

	private SlideEntity convertToEntity(SlideDTO dto) {
		return slideMapper.toEntity(dto);
	}

	@Override
	public void updateStatus(int id, int status) {
		SlideRepository.updateStatusById(id, status);
	}

	@Override
	public void updateTrash(int id, String trash) {
		SlideRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		SlideRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public SlideDTO findById(int masp) {
		Optional<SlideEntity> entity = SlideRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) SlideRepository.count();
		int numTrash = (int) SlideRepository.countByTrash("disable");

		return (int) (numTotal - numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) SlideRepository.countByTrash("disable");
	}

	@Override
	public SlideDTO save(SlideDTO ncc) {
		SlideEntity entity = convertToEntity(ncc);
		SlideEntity savedEntity = SlideRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public List<SlideDTO> findTrash() {
		List<SlideEntity> entities = SlideRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
}
