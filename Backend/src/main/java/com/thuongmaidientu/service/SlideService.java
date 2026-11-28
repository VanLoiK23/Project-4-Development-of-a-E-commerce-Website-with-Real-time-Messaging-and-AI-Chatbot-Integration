package com.thuongmaidientu.service;

import java.util.List;

import org.hibernate.query.Page;
import org.springframework.data.domain.Pageable;

import com.thuongmaidientu.dto.ColorDTO;
import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.dto.SlideDTO;
import com.thuongmaidientu.dto.response.SlideResponse;

public interface SlideService {
	List<SlideDTO> findAll(Pageable pageable);

	List<SlideDTO> selectAll();

	SlideDTO findById(int id);

	SlideDTO save(SlideDTO ncc);

	List<SlideDTO> findTrash();

	int getTotalItem();

	int getTotalItemTrash();

	void updateStatus(int id, int status);

	void updateTrash(int id, String status);

	void delete(int id);

	List<SlideResponse> fetchSlides();
}
