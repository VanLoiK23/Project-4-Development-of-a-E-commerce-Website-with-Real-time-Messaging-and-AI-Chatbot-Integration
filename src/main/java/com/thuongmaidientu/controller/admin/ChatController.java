package com.thuongmaidientu.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.thuongmaidientu.dto.UserDTO;

import jakarta.servlet.http.HttpSession;

@Controller(value = "chatControllerOfAdmin")
public class ChatController {
	
	@RequestMapping(value = "/quan-tri/chat-with-Client", method = RequestMethod.GET)
	public ModelAndView chat(HttpSession session) {
		ModelAndView mav = new ModelAndView("admin/chat/chatWithClient");

		UserDTO userDTO = (UserDTO) session.getAttribute("user");

		mav.addObject("user", userDTO);
		return new ModelAndView("admin/chat/chatWithClient");
	}
	
}
