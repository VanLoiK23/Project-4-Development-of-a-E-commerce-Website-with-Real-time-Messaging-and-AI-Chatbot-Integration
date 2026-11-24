package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ArticleMapper;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ArticleDTO;
import com.thuongmaidientu.entity.ArticleEntity;
import com.thuongmaidientu.repository.ArticleRepository;
import com.thuongmaidientu.service.ArticleService;

@Service
public class ArticleServiceImpl implements ArticleService {
	@Autowired
	private ArticleMapper articleMapper;

	@Autowired
	private ArticleRepository ArticleRepository;

	@Autowired
	private CommentArticleServiceImpl commentArticleService;

	@Override
	public List<ArticleDTO> findAll(Pageable pageable) {
		List<ArticleEntity> entities = ArticleRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ArticleDTO> selectAll() {
		List<ArticleEntity> entities = ArticleRepository.findByTrash("active");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private ArticleDTO convertToDTO(ArticleEntity entity) {
		ArticleDTO dto = articleMapper.toDTO(entity);
		if (dto == null) {
			return null;
		}
		dto.setNum_trash(getTotalItemTrash());
		if (entity.getListComment() != null) {
			dto.setListComment(
					entity.getListComment().stream().map(commentArticleService::convertToDTO).collect(Collectors.toList()));
		}
		return dto;
	}

	public ArticleEntity convertToEntity(ArticleDTO dto) {
		ArticleEntity entity = articleMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}
		if (entity.getCreateAt() == null) {
			entity.setCreateAt(new Date());
		}
		return entity;
	}

	@Override
	public void updateStatus(int id, int status) {
		ArticleRepository.updateStatusById(id, status);
	}

	@Override
	public void updateTrash(int id, String trash) {
		ArticleRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		ArticleRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public ArticleDTO findById(int masp) {

		Optional<ArticleEntity> entity = ArticleRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) ArticleRepository.count();
		int numTrash = (int) ArticleRepository.countByTrash("disable");

		return (int) (numTotal - numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) ArticleRepository.countByTrash("disable");
	}

	@Override
	public ArticleDTO save(ArticleDTO ncc) {
		ArticleEntity entity = convertToEntity(ncc);
		ArticleEntity savedEntity = ArticleRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public int getIdByValue(String value) {
		return ArticleRepository.selectIdByValue(value);
	}

	@Override
	public boolean checkNewValue(String value) {
		return ArticleRepository.existsByTitleAllIgnoreCase(value);
	}

	@Override
	public List<ArticleDTO> findTrash() {
		List<ArticleEntity> entities = ArticleRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public Integer getNextId(Integer id) {
		Integer idNextInteger=ArticleRepository.getNextIdArticle(id);
		return (idNextInteger!=null)?idNextInteger:ArticleRepository.getMinID();
	}

	@Override
	public Integer getPreviousId(Integer id) {
		Integer idPreInteger=ArticleRepository.getPreviousIdArticle(id);

		return (idPreInteger!=null)?idPreInteger:ArticleRepository.getMaxID();
	}
}
