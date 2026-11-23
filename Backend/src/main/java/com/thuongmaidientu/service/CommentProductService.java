package com.thuongmaidientu.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.thuongmaidientu.dto.CommentProductDTO;

public interface CommentProductService {
	List<CommentProductDTO> findAll(Pageable pageable);

	List<CommentProductDTO> selectAll();

	CommentProductDTO findById(int id);

	CommentProductDTO save(CommentProductDTO ncc);

	int getTotalItem();

	void delete(int id);
	
	List<CommentProductDTO> findAllByRateAndStatus(Integer rate, Integer st, Pageable pageable);
	
	Integer countOffindAllByRateAndStatus(Integer rate, Integer st);

	int getTotalItemByRateAndStatus(Integer rate, Integer st);
	
	void updateFeeback(CommentProductDTO dto);
	
	void updateReview(CommentProductDTO dto);
	
	List<CommentProductDTO> findByProductId(Integer id);
	
	void deleteComment(Integer maPB);
	
	CommentProductDTO getExistCommentByMaspAndOrderId(Integer masp,Integer orderId,Integer clientId);
}
