package com.thuongmaidientu.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.thuongmaidientu.dto.ColorDTO;

public interface ColorService {
	List<ColorDTO> findAll(Pageable pageable);

	List<ColorDTO> selectAll();
	
	ColorDTO findById(int id);
	
	ColorDTO save(ColorDTO color);
	
	int getTotalItem();
	
	List<ColorDTO> findTrash();
	
	int getTotalItemTrash();
	
	int getIdByValue(String color);
	
	void updateStatus(int id,int status);
	
	void updateTrash(int id,String status);
	
	void delete(int id);
	
	boolean checkNewValue(String value);
}
