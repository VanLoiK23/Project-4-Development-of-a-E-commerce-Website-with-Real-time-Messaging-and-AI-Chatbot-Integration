package com.thuongmaidientu.api.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.thuongmaidientu.dto.KhuVucKhoDTO;
import com.thuongmaidientu.service.CategoryService;
import com.thuongmaidientu.service.ColorService;
import com.thuongmaidientu.service.KhuVucKhoService;
import com.thuongmaidientu.service.RamService;
import com.thuongmaidientu.service.RomService;
import com.thuongmaidientu.service.XuatxuService;

@RestController(value = "KhoApiOfAdmin")
@RequestMapping("/quan-tri/khu-vuc-kho")
public class KhuVucKhoAPI {
	@Autowired
	private KhuVucKhoService khoService;

	@DeleteMapping
	public ResponseEntity<String> deleteKho(@RequestParam("id") int id) {
		try {
			khoService.updateTrash(id, "disable");

			return ResponseEntity.ok("Delete Success");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@RequestMapping(value = "/check-kho-name", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> checkAttributeName(@RequestParam("new") String newValue) {
		Map<String, Object> response = new HashMap<>();
		boolean exists = false;

		exists = khoService.checkNewValue(newValue);

		response.put("exists", exists);

		return response;
	}

	@RequestMapping(value = "/edit_Kho", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> edit_Attribute(@RequestParam("id") Integer id) {
		Map<String, Object> response = new HashMap<>();

		response.put("exists", khoService.findById(id));

		return response;
	}
	
	@GetMapping
	public ResponseEntity<List<KhuVucKhoDTO>> getKho() {
		try {
			List<KhuVucKhoDTO> pDto = khoService.selectAll();
			if (pDto == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
			return ResponseEntity.ok(pDto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
