package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.CommentArticleMapper;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.CommentArticleDTO;
import com.thuongmaidientu.entity.ArticleEntity;
import com.thuongmaidientu.entity.CommentArticleEntity;
import com.thuongmaidientu.entity.KhachHangEntity;
import com.thuongmaidientu.repository.CommentArticleRepository;
import com.thuongmaidientu.service.CommentArticleService;

@Service
public class CommentArticleServiceImpl implements CommentArticleService {
	@Autowired
	private CommentArticleMapper commentArticleMapper;


	@Autowired
	private CommentArticleRepository commentArticleRepository;


	public CommentArticleDTO convertToDTO(CommentArticleEntity entity) {
		CommentArticleDTO dto = commentArticleMapper.toDTO(entity);
		if (dto == null) {
			return null;
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());

		if (entity.getNgayPhanHoi() != null && dto.getNgayPhanHoi() != null) {
			dto.setNgayPhanHoiString(sdf1.format(dto.getNgayPhanHoi()));
		}
		if (dto.getNgayDanhGia() != null) {
			dto.setNgayDanhGiaString(sdf.format(dto.getNgayDanhGia()));
		}

		return dto;
	}

	public CommentArticleEntity convertToEntity(CommentArticleDTO dto) {
		CommentArticleEntity entity = commentArticleMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		if (dto.getIdClient() != null) {
			KhachHangEntity kh = new KhachHangEntity();
			kh.setMaKhachHang(dto.getIdClient());
			entity.setKh(kh);
		}
		if (dto.getIdArticle() != null) {
			ArticleEntity article = new ArticleEntity();
			article.setId(dto.getIdArticle());
			entity.setArticle(article);
		}

		return entity;
	}

	@Override
	public List<CommentArticleDTO> findAll(Pageable pageable) {
		List<CommentArticleEntity> entities = commentArticleRepository.findAll(pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<CommentArticleDTO> selectAll() {
		List<CommentArticleEntity> entities = commentArticleRepository.findAll();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public CommentArticleDTO findById(int id) {
		Optional<CommentArticleEntity> entity = commentArticleRepository.findById(id);
		System.out.println("Test "+entity);
		
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public CommentArticleDTO save(CommentArticleDTO ncc) {
		CommentArticleEntity entity = convertToEntity(ncc);
		CommentArticleEntity savedEntity = commentArticleRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) commentArticleRepository.count();
		return numTotal;
	}

	@Override
	public void delete(int id) {
		commentArticleRepository.deleteById(id);
	}

	@Override
	public List<CommentArticleDTO> findAllByRateAndStatus(Integer rate, Integer st, Pageable pageable) {
		// TODO Auto-generated method stub
		List<CommentArticleEntity> entities = commentArticleRepository.findAllByOptionalFilters(rate, st, pageable);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}
	
	@Override
	public Integer countOffindAllByRateAndStatus(Integer rate, Integer st) {
		// TODO Auto-generated method stub
		return commentArticleRepository.countByOptionalFilters(rate, st);
	}

	@Override
	public int getTotalItemByRateAndStatus(Integer rate, Integer st) {
		return commentArticleRepository.countByOptionalFilters(rate, st);
	}

	@Override
	public void updateFeeback(CommentArticleDTO dto) {
		commentArticleRepository.updateFeeback(dto.getId().intValue(), dto.getFeedback(), dto.getContentFeedback(),
				dto.getNhanVien(), dto.getNgayPhanHoi());
	}

	@Override
	public void updateReview(CommentArticleDTO dto) {
		commentArticleRepository.updateReview(dto.getId().intValue(), dto.getContent(), dto.getRating());
	}

	@Override
	public List<CommentArticleDTO> findByArticleId(Integer id) {
		ArticleEntity articleEntity=new ArticleEntity();
		articleEntity.setId(id);
		List<CommentArticleEntity> entities = commentArticleRepository.findByArticle(articleEntity);

		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public void deleteComment(Integer maPB) {

		CommentArticleEntity commentArticleEntity=new CommentArticleEntity();
		commentArticleEntity.setId(maPB);
		
		commentArticleRepository.delete(commentArticleEntity);
	}
	
}
