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
import com.thuongmaidientu.service.IChatMessageService;
import com.thuongmaidientu.service.IPhieuXuatService;
import com.thuongmaidientu.service.IThongKeService;
import com.thuongmaidientu.service.impl.ChatMessageService;

import jakarta.servlet.http.HttpSession;

@Controller("HomepageAdminOfController")
public class Homepage_admin {

	@Autowired
	private IThongKeService thongKeService;

	private IChatMessageService chatMessageService = new ChatMessageService();

	@RequestMapping(value = "/quan-tri/Homepage_admin", method = RequestMethod.GET)
	public ModelAndView showlist(HttpSession session) {

		ModelAndView mav = new ModelAndView("admin/homepage/admin_homepage2");

		ThongkeDTO thongkeDTO = new ThongkeDTO();
		thongkeDTO.setQuantityProduct(thongKeService.getCountProduct());
		thongkeDTO.setQuantityPurchase(thongKeService.getCountPurchase());
		thongkeDTO.setQuantityUser(thongKeService.getCountUser());
		thongkeDTO.setQuantityWareHouse(thongKeService.getCountWareHouse());

		mav.addObject("dto", thongkeDTO);

		session.setAttribute("numberMsg", chatMessageService.getQuantityClientChat());

		return mav;
	}

}
