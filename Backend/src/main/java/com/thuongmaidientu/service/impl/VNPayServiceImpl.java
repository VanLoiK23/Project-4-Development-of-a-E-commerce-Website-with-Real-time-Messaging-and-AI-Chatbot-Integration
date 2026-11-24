package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.VNPayMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.VNPayDTO;
import com.thuongmaidientu.entity.VNPayEntity;
import com.thuongmaidientu.repository.VNPayRepository;
import com.thuongmaidientu.service.VNPayService;

@Service
public class VNPayServiceImpl implements VNPayService {
	@Autowired
	private VNPayMapper vnPayMapper;


	@Autowired
	private VNPayRepository vnPayRepository;

	@Override
	public boolean insertVNPay(VNPayDTO dto) {
		return vnPayRepository.save(convertToEntity(dto)) != null;
	}

	public VNPayEntity convertToEntity(VNPayDTO dto) {
		return vnPayMapper.toEntity(dto);
	}

}
