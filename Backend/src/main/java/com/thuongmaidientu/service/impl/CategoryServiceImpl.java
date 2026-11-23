package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.CategoryMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.CategoryDTO;
import com.thuongmaidientu.entity.CategoryEntity;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.repository.CategoryRepository;
import com.thuongmaidientu.service.CategotyService;

@Service
public class CategoryServiceImpl implements CategotyService {
	@Autowired
	private CategoryMapper categoryMapper;

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public List<CategoryDTO> findAll(Pageable pageable) {
		List<CategoryEntity> entities = categoryRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<CategoryDTO> selectAll() {
		List<CategoryEntity> entities = categoryRepository.findByTrash("active");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private CategoryDTO convertToDTO(CategoryEntity entity) {
		CategoryDTO dto = categoryMapper.toDTO(entity);
		if (dto == null) {
			return null;
		}
		dto.setNum_trash(getTotalItemTrash());
		return dto;
	}

	public CategoryEntity convertToEntity(CategoryDTO dto) {
		CategoryEntity entity = categoryMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}
		if (dto.getId() == null || dto.getId() == -1) {
			entity.setMaThuongHieu(null);
		}
		return entity;
	}

	@Override
	public void updateStatus(int id, int status) {
		categoryRepository.updateStatusById(id, status);
	}

	@Override
	public void updateTrash(int id, String trash) {
		categoryRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		categoryRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public CategoryDTO findById(int masp) {
		Optional<CategoryEntity> entity = categoryRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) categoryRepository.count();
		int numTrash = (int) categoryRepository.countByTrash("disable");

		return (int) (numTotal - numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) categoryRepository.countByTrash("disable");
	}

	@Override
	public CategoryDTO save(CategoryDTO cate) {
		CategoryEntity entity = convertToEntity(cate);
		CategoryEntity savedEntity = categoryRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public boolean checkNewValue(String value) {
		return categoryRepository.existsByTenThuongHieuAllIgnoreCase(value);
	}

	@Override
	public String getImageOld(int ma) {
		return categoryRepository.findImageByTenMauSac(ma);
	}

	@Override
	public List<CategoryDTO> findTrash() {
		List<CategoryEntity> entities = categoryRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public Integer getIdCategory(String name) {
		List<CategoryEntity> categoryEntities = categoryRepository.findByTenThuongHieu(name);
		return (categoryEntities != null) ? categoryEntities.get(0).getMaThuongHieu() : null;
	}
}
