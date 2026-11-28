package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ArticleMapper;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ArticleDTO;
import com.thuongmaidientu.dto.response.ArticleResponse;
import com.thuongmaidientu.entity.ArticleEntity;
import com.thuongmaidientu.repository.ArticleRepository;
import com.thuongmaidientu.service.ArticleService;

@Service
public class ArticleServiceImpl implements ArticleService {
	@Autowired
	private ArticleMapper articleMapper;

	@Autowired
	private ArticleRepository articleRepository;

	@Autowired
	private CommentArticleServiceImpl commentArticleService;

	@Override
	public List<ArticleDTO> findAll(Pageable pageable) {
		List<ArticleEntity> entities = articleRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ArticleDTO> selectAll() {
		List<ArticleEntity> entities = articleRepository.findByTrash("active");
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
					entity.getListComment().stream().map(commentArticleService::convertToDTO)
							.collect(Collectors.toList()));
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
		articleRepository.updateStatusById(id, status);
	}

	@Override
	public void updateTrash(int id, String trash) {
		articleRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		articleRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public ArticleDTO findById(int masp) {

		Optional<ArticleEntity> entity = articleRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) articleRepository.count();
		int numTrash = (int) articleRepository.countByTrash("disable");

		return (int) (numTotal - numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) articleRepository.countByTrash("disable");
	}

	@Override
	public ArticleDTO save(ArticleDTO ncc) {
		ArticleEntity entity = convertToEntity(ncc);
		ArticleEntity savedEntity = articleRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public int getIdByValue(String value) {
		return articleRepository.selectIdByValue(value);
	}

	@Override
	public boolean checkNewValue(String value) {
		return articleRepository.existsByTitleAllIgnoreCase(value);
	}

	@Override
	public List<ArticleDTO> findTrash() {
		List<ArticleEntity> entities = articleRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public Integer getNextId(Integer id) {
		Integer idNextInteger = articleRepository.getNextIdArticle(id);
		return (idNextInteger != null) ? idNextInteger : articleRepository.getMinID();
	}

	@Override
	public Integer getPreviousId(Integer id) {
		Integer idPreInteger = articleRepository.getPreviousIdArticle(id);

		return (idPreInteger != null) ? idPreInteger : articleRepository.getMaxID();
	}

	@Override
	public Page<ArticleResponse> fetchAritcles(Pageable pageable) {
		Page<ArticleEntity> entities = articleRepository.findAll(pageable);

		return entities.map(articleMapper::toResponse);
	}
}
