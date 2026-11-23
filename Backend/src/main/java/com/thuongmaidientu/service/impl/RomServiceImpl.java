package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.RomMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.RomDTO;
import com.thuongmaidientu.entity.CategoryEntity;
import com.thuongmaidientu.entity.RomEntity;
import com.thuongmaidientu.repository.RomRepository;
import com.thuongmaidientu.service.RomService;

@Service
public class RomServiceImpl implements RomService {
	@Autowired
	private RomMapper romMapper;

	@Autowired
	private RomRepository RomRepository;

	@Override
	public List<RomDTO> findAll(Pageable pageable) {
		List<RomEntity> entities = RomRepository.findByTrash("active", pageable).getContent();
	    return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<RomDTO> selectAll() {
		List<RomEntity> entities = RomRepository.findByTrash("active");
	    return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
	
	
	private RomDTO convertToDTO(RomEntity entity) {
		RomDTO dto = romMapper.toDTO(entity);
		if (dto != null) {
			dto.setNum_trash(getTotalItemTrash());
		}
		return dto;
	}
	
	public RomEntity convertToEntity(RomDTO dto) {
		return romMapper.toEntity(dto);
	}
	
	@Override
	public void updateStatus(int id, int status) {
		RomRepository.updateStatusById(id, status);
	}
	
	@Override
	public void updateTrash(int id, String trash) {
		RomRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		RomRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public RomDTO findById(int masp) {
	    Optional<RomEntity> entity = RomRepository.findById((long) masp);
	    return entity.map(this::convertToDTO).orElse(null); 
	}
	
	@Override
	public int getTotalItem() {
		int numTotal=(int) RomRepository.count();
		int numTrash=(int) RomRepository.countByTrash("disable");
		
		return (int) (numTotal-numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) RomRepository.countByTrash("disable");
	}

	@Override
	public RomDTO save(RomDTO ncc) {
		RomEntity entity = convertToEntity(ncc);
		RomEntity savedEntity = RomRepository.save(entity);
		return convertToDTO(savedEntity);
	}
	
	@Override
	public int getIdByValue(Integer r) {
		return RomRepository.selectIdByValue(r);
	}

	@Override
	public boolean checkNewValue(Integer value) {
		return RomRepository.existsByKichThuocRomAllIgnoreCase(value);
	}

	@Override
	public List<RomDTO> findTrash() {
		List<RomEntity> entities = RomRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
}
