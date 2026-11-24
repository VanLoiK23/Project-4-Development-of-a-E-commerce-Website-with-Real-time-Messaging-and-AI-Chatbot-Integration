package com.thuongmaidientu.service;

import java.util.List;

import com.thuongmaidientu.dto.CTPhieuNhapDTO;

public interface CTPhieuNhapService {

	void delete(Long mapb);
	
	Integer countNumberProductNhap(Integer mapb);
	
	Integer countNumberProductNhapANDMaPBSP(Integer mapb,Integer mapn);
	
	void saveCTPN(CTPhieuNhapDTO pn);
	
	List<CTPhieuNhapDTO> getListCTPN(Integer id);

	void deletePN(Integer maPB);

}
