package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.PhieuNhapMapper;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.NhaCungCapDTO;
import com.thuongmaidientu.dto.NhanVienDTO;
import com.thuongmaidientu.dto.PhieuNhapDTO;
import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.entity.PhieuNhapEntity;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.repository.PhieuNhapRepository;
import com.thuongmaidientu.service.PhieuNhapService;

@Service
public class PhieuNhapServiceImpl implements PhieuNhapService {
	@Autowired
	private PhieuNhapMapper phieuNhapMapper;


	@Autowired
	private PhieuNhapRepository phieuNhapRepository;

	@Autowired
	private NhacungcapServiceImpl nhacungcapRepository;

	@Autowired
	private NhanvienServiceImpl nhanvienRepository;

	@Override
	public PhieuNhapDTO save(PhieuNhapDTO pn) {
		PhieuNhapEntity entity = convertToEntity(pn);
		PhieuNhapEntity savedEntity = phieuNhapRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	// Convert Entity -> DTO
	private PhieuNhapDTO convertToDTO(PhieuNhapEntity entity) {
		return phieuNhapMapper.toDTO(entity);
	}

	// Convert DTO -> Entity
	public PhieuNhapEntity convertToEntity(PhieuNhapDTO dto) {
		PhieuNhapEntity entity = phieuNhapMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		if (entity.getThoiGian() == null) {
			entity.setThoiGian(new Date());
		}

		Optional.ofNullable(dto.getNguoiTaoPhieuId()).ifPresent(id -> {
			NhanVienDTO productDTO = nhanvienRepository.findById(id);
			if (productDTO != null) {
				entity.setNguoiTaoPhieu(nhanvienRepository.convertToEntity(productDTO));
			}
		});

		Optional.ofNullable(dto.getNhaCungCapID()).ifPresent(id -> {
			NhaCungCapDTO productDTO = nhacungcapRepository.findById(id);
			if (productDTO != null) {
				entity.setNhaCungCap(nhacungcapRepository.convertToEntity(productDTO));
			}
		});

		return entity;
	}

	@Override
	public List<PhieuNhapDTO> findTrash() {
		List<PhieuNhapEntity> entities = phieuNhapRepository.findBySave("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public PhieuNhapDTO findById(int masp) {
		Optional<PhieuNhapEntity> entity = phieuNhapRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public List<PhieuNhapDTO> findAll(Pageable pageable) {
		List<PhieuNhapEntity> entities = phieuNhapRepository.findBySave("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) phieuNhapRepository.count();
		int numTrash = (int) phieuNhapRepository.countBySave("disable");

		return (int) (numTotal - numTrash);
	}

	public int getAllTotal() {
		int numTotal = (int) phieuNhapRepository.count();

		return (int) (numTotal);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) phieuNhapRepository.countBySave("disable");
	}

	@Override
	public void updateTrash(int id, String trash) {
		phieuNhapRepository.updateSaveById(id, trash);
	}

	@Override
	public List<PhieuNhapDTO> findAllByDate(Date fromDate, Pageable pageable) {
		// TODO Auto-generated method stub

		List<PhieuNhapEntity> entities = phieuNhapRepository.findAllByDate(fromDate, pageable);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public int getTotalItemByDate(Date fromDate) {
		return phieuNhapRepository.countByDate(fromDate);
	}

	@Override
	public List<String> getImportFinancingStatisticalByTimeFilter(String timeFilter) {
		List<Object[]> results = new ArrayList<Object[]>();
		List<String> fullDates;

		switch (timeFilter) {
		case "week": {
			results = phieuNhapRepository.getImportFinancingStatisticalFollowWeek();

			fullDates = List.of("Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7");

			break;
		}
		case "month": {
			results = phieuNhapRepository.getImportFinancingStatisticalFollowMonth();

			fullDates = List.of("Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5");

			break;
		}
		case "quarter": {
			results = phieuNhapRepository.getImportFinancingStatisticalFollowQuarter();

			fullDates = List.of("1", "2", "3", "4");

			break;
		}
		default:
			results = phieuNhapRepository.getImportFinancingStatisticalFollowYear();

			fullDates = List.of("Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
					"Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12");

			break;
		}

		List<String> dataList = new ArrayList<String>();
		Map<String, Double> dataMap = new HashMap<>();

		for (Object[] record : results) {
			String dayOf = (String) (record[0]).toString();
			Double total = ((Number) record[1]).doubleValue();
			dataMap.put(dayOf, total);
		}

		for (String date : fullDates) {
			dataList.add(formatCurrency(dataMap.getOrDefault(date, 0.0)));
		}

		return dataList;
	}

	public String formatCurrency(double amount) {
		Locale localeVN = new Locale("vi", "VN");
		NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(localeVN);
		return currencyFormatter.format(amount);
	}

}
