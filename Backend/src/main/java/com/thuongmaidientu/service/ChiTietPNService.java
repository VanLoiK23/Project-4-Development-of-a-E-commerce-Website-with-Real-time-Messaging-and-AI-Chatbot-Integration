package com.thuongmaidientu.service;

import java.util.List;

import com.thuongmaidientu.dto.ChiTietPhieuNhapDTO;

public interface ChiTietPNService {

	void delete(Long mapb);
	
	Integer countNumberProductNhap(Integer mapb);
	
	Integer countNumberProductNhapANDMaPBSP(Integer mapb,Integer mapn);
	
	void saveCTPN(ChiTietPhieuNhapDTO pn);
	
	List<ChiTietPhieuNhapDTO> getListCTPN(Integer id);

	void deletePN(Integer maPB);

}
