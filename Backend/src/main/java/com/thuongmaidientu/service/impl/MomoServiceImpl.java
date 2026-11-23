package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.MomoMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.MomoDTO;
import com.thuongmaidientu.entity.MomoEntity;
import com.thuongmaidientu.repository.MomoRepository;
import com.thuongmaidientu.service.MomoService;

@Service
public class MomoServiceImpl implements MomoService {
	@Autowired
	private MomoMapper momoMapper;


	@Autowired
	private MomoRepository momoRepository;

	@Override
	public boolean insertMomo(MomoDTO dto) {
		return momoRepository.save(convertToEntity(dto)) != null;
	}

	public MomoEntity convertToEntity(MomoDTO dto) {
		return momoMapper.toEntity(dto);
	}

}
