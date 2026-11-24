package com.thuongmaidientu.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.service.ThongKeService;

@Service
public class ThongKeServiceImpl implements ThongKeService {

	@Autowired
	private ProductServiceImpl productService;

	@Autowired
	private KhuVucKhoServiceImpl khoService;

	@Autowired
	private KhachHangServiceImpl khachHangService;

	@Autowired
	private PhieuNhapServiceImpl phieuNhapService;

	@Autowired
	private PhieuXuatServiceImpl phieuXuatService;

	@Override
	public Integer getCountWareHouse() {
		return khoService.getTotalItem();
	}

	@Override
	public Integer getCountProduct() {
		return productService.getTotalItem();
	}

	@Override
	public Integer getCountPurchase() {
		return phieuNhapService.getAllTotal() + phieuXuatService.getAllTotalNotCancel();
	}

}
