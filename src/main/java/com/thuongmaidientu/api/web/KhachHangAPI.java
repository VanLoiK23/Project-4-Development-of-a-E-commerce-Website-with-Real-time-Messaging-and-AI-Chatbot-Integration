package com.thuongmaidientu.api.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thuongmaidientu.dto.ThongTinGiaoHangDTO;
import com.thuongmaidientu.dto.UserDTO;
import com.thuongmaidientu.service.IKhachHangService;
import com.thuongmaidientu.service.IThongTinGiaoHangService;

import jakarta.servlet.http.HttpSession;

@RestController(value = "clientApiOfWeb")
@RequestMapping("/khach-hang")
public class KhachHangAPI {

	@Autowired
	IKhachHangService khachHangService;

	@Autowired
	IThongTinGiaoHangService thongTinGiaoHangService;

	@PostMapping("/checkUser_name")
	public ResponseEntity<?> checkIsExistUserName(@RequestParam("name") String name) {
		try {
			return ResponseEntity.ok(khachHangService.isExistUserName(name));
		} catch (Exception e) {
			e.printStackTrace(); // ✅ In ra lỗi đầy đủ
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
		}
	}

	@PostMapping("/checkEmail")
	public ResponseEntity<?> checkIsExistEmail(@RequestParam("email") String email) {
		try {
			return ResponseEntity.ok(khachHangService.isExistEmail(email));
		} catch (Exception e) {
			e.printStackTrace(); // ✅ In ra lỗi đầy đủ
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
		}
	}

	@PostMapping("/checkAccountIsLock")
	public ResponseEntity<?> checkAccountIsLock(
			@RequestParam(value = "email", required = false, defaultValue = "") String email,
			@RequestParam(value = "phone", required = false, defaultValue = "") String phone) {
		try {

			email = (email == null || email.isEmpty()) ? null : email;
			phone = (phone == null || phone.isEmpty()) ? null : phone;

			return ResponseEntity.ok(khachHangService.checkIsLockByPhoneOrEmail(email, phone));
		} catch (Exception e) {
			e.printStackTrace(); // ✅ In ra lỗi đầy đủ
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
		}
	}

	@GetMapping("/getInfoShipping")
	public ResponseEntity<?> getInfoShippingByUser(HttpSession session) {
		try {
			UserDTO userDTO = (UserDTO) session.getAttribute("user");

			if (userDTO == null) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không tìm thấy người dùng");
			}
			List<ThongTinGiaoHangDTO> thongTinGiaoHangDTOs = thongTinGiaoHangService
					.getAllByIdkh(userDTO.getId().intValue());

			ThongTinGiaoHangDTO thongTinGiaoHangDTO = new ThongTinGiaoHangDTO();

			if (thongTinGiaoHangDTO == null || thongTinGiaoHangDTOs.isEmpty()) {

				thongTinGiaoHangDTO = null;
			} else {
				thongTinGiaoHangDTO = thongTinGiaoHangDTOs.get(0);// first address
			}

			return ResponseEntity.ok(thongTinGiaoHangDTO);
		} catch (Exception e) {
			e.printStackTrace(); // ✅ In ra lỗi đầy đủ
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
		}
	}

}
