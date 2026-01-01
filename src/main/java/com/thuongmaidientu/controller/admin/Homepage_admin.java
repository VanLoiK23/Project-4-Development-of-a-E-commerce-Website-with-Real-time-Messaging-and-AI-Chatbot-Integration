package com.thuongmaidientu.controller.admin;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.thuongmaidientu.dto.PaymentStatisticalDTO;
import com.thuongmaidientu.dto.PhieuXuatDTO;
import com.thuongmaidientu.dto.ThongkeDTO;
import com.thuongmaidientu.service.IPhieuXuatService;
import com.thuongmaidientu.service.IThongKeService;

@Controller("HomepageAdminOfController")
public class Homepage_admin {

	@Autowired
	private IThongKeService thongKeService;

	@Autowired
	private IPhieuXuatService phieuXuatService;

	@RequestMapping(value = "/quan-tri/test", method = RequestMethod.GET)
	public ModelAndView test() {
		return new ModelAndView("admin/homepage/admin_homepage2");
	}

	@RequestMapping(value = "/quan-tri/Homepage_admin", method = RequestMethod.GET)
	public ModelAndView showlist() {

		ModelAndView mav = new ModelAndView("admin/homepage/admin_homepage2");

		ThongkeDTO thongkeDTO = new ThongkeDTO();
		thongkeDTO.setQuantityProduct(thongKeService.getCountProduct());
		thongkeDTO.setQuantityPurchase(thongKeService.getCountPurchase());
		thongkeDTO.setQuantityUser(thongKeService.getCountUser());
		thongkeDTO.setQuantityWareHouse(thongKeService.getCountWareHouse());

		mav.addObject("dto", thongkeDTO);
		return mav;
	}

}
