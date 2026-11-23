package com.thuongmaidientu.service;

import java.util.List;

import com.thuongmaidientu.dto.CTPhieuXuatDTO;

public interface CTPhieuXuatService {
	void delete(Long mapb);
	
	Integer countNumberProductSold(Integer mapb);
	
	Integer countNumberProductXuatANDMaPBSP(Integer mapb,Integer mapx);
	
	void saveCTPX(CTPhieuXuatDTO px);
	
	List<CTPhieuXuatDTO> getListCTPX(Integer id);
	
	void deletePX(Integer maPB);

}
