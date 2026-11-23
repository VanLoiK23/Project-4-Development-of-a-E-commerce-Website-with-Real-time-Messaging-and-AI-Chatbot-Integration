package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.CommentAndRateMapper;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.CommentAndRateDTO;
import com.thuongmaidientu.entity.CommentAndRateEntity;
import com.thuongmaidientu.entity.KhachHangEntity;
import com.thuongmaidientu.entity.PhieuXuatEntity;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.repository.CommentAndRateRepository;
import com.thuongmaidientu.service.CommentAndRateService;

@Service
public class CommentAndRateServiceImpl implements CommentAndRateService {
	@Autowired
	private CommentAndRateMapper commentAndRateMapper;


	@Autowired
	private CommentAndRateRepository commentAndRateRepository;

	private CommentAndRateDTO convertToDTO(CommentAndRateEntity entity) {
		CommentAndRateDTO dto = commentAndRateMapper.toDTO(entity);
		if (dto == null) {
			return null;
		}

		if (entity.getUser() == null) {
			dto.setId_user(null);
			if (entity.getUserHash() != null && !entity.getUserHash().isEmpty()) {
				dto.setHoten("Khách hàng " + entity.getUserHash().substring(0, Math.min(6, entity.getUserHash().length())));
			} else {
				dto.setHoten("Người dùng ẩn danh");
			}
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());

		if (entity.getNgayPhanHoi() != null && dto.getNgayPH() != null) {
			dto.setNgayphanhoi(sdf1.format(dto.getNgayPH()));
		}
		if (dto.getNgayDanhGia() != null) {
			dto.setNgay_đanhgia(sdf.format(dto.getNgayDanhGia()));
		}

		return dto;
	}

	public CommentAndRateEntity convertToEntity(CommentAndRateDTO dto) {
		CommentAndRateEntity entity = commentAndRateMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		if (entity.getNgayDanhGia() == null) {
			entity.setNgayDanhGia(new Date());
		}
		if (dto.getImg() != null && !dto.getImg().trim().isEmpty()) {
			entity.setHasMedia(1);
		} else if (dto.getHasMedia() != null) {
			entity.setHasMedia(dto.getHasMedia());
		} else {
			entity.setHasMedia(0);
		}

		if (dto.getId_user() != null) {
			KhachHangEntity userEntity = new KhachHangEntity();
			userEntity.setMaKhachHang(dto.getId_user());
			entity.setUser(userEntity);
		} else {
			entity.setUser(null);
		}

		if (dto.getId_sp() != null) {
			ProductEntity productEntity = new ProductEntity();
			productEntity.setId(dto.getId_sp());
			entity.setProduct(productEntity);
		}

		if (dto.getOrder_id() != null) {
			PhieuXuatEntity phieuXuatEntity = new PhieuXuatEntity();
			phieuXuatEntity.setId(dto.getOrder_id());
			entity.setOrder(phieuXuatEntity);
		} else {
			entity.setOrder(null);
		}

		return entity;
	}

	@Override
	public List<CommentAndRateDTO> findAll(Pageable pageable) {
		List<CommentAndRateEntity> entities = commentAndRateRepository.findAll(pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<CommentAndRateDTO> selectAll() {
		List<CommentAndRateEntity> entities = commentAndRateRepository.findAll();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public CommentAndRateDTO findById(int id) {
		Optional<CommentAndRateEntity> entity = commentAndRateRepository.findById(id);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public CommentAndRateDTO save(CommentAndRateDTO ncc) {
		CommentAndRateEntity entity = convertToEntity(ncc);
		CommentAndRateEntity savedEntity = commentAndRateRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public int getTotalItem() {
		return (int) commentAndRateRepository.count();
	}

	@Override
	public void delete(int id) {
		commentAndRateRepository.deleteById(id);
	}

	@Override
	public List<CommentAndRateDTO> findAllByRateAndStatus(Integer rate, Integer st, Pageable pageable) {
		List<CommentAndRateEntity> entities = commentAndRateRepository.findAllByOptionalFilters(rate, st, pageable);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public Integer countOffindAllByRateAndStatus(Integer rate, Integer st) {
		return commentAndRateRepository.countByOptionalFilters(rate, st);
	}

	@Override
	public int getTotalItemByRateAndStatus(Integer rate, Integer st) {
		return commentAndRateRepository.countByOptionalFilters(rate, st);
	}

	@Override
	public void updateFeeback(CommentAndRateDTO dto) {
		commentAndRateRepository.updateFeeback(dto.getId().intValue(), dto.getFeeback(), dto.getFeedbackContent(),
				dto.getNhanvien(), dto.getNgayPH());
	}

	@Override
	public void updateReview(CommentAndRateDTO dto) {
		commentAndRateRepository.updateReview(dto.getId().intValue(), dto.getContent(), dto.getRate(), dto.getImg());
	}

	@Override
	public List<CommentAndRateDTO> findByProductId(Integer id) {
		ProductEntity productEntity = new ProductEntity();
		productEntity.setId(id);
		List<CommentAndRateEntity> entities = commentAndRateRepository.findByProduct(productEntity);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public void deleteComment(Integer maPB) {
		ProductEntity productEntity = new ProductEntity();
		productEntity.setId(maPB);
		commentAndRateRepository.deleteByProduct(productEntity);
	}

	@Override
	public CommentAndRateDTO getExistCommentByMaspAndOrderId(Integer masp, Integer orderID, Integer clientId) {
		List<CommentAndRateEntity> entities = commentAndRateRepository.findByProductIdAndOrderId(masp, orderID,
				clientId);
		return (entities != null && !entities.isEmpty()) ? convertToDTO(entities.get(0)) : null;
	}

}
