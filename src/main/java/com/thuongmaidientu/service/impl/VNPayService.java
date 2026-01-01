package com.thuongmaidientu.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.VNPayDTO;
import com.thuongmaidientu.entity.VNPayEntity;
import com.thuongmaidientu.repository.VNPayRepository;
import com.thuongmaidientu.service.IVNPayService;

@Service
public class VNPayService implements IVNPayService {

	@Autowired
	private VNPayRepository vnPayRepository;

	@Override
	public boolean insertVNPay(VNPayDTO dto) {
		return vnPayRepository.save(convertToEntity(dto)) != null;
	}

	public VNPayEntity convertToEntity(VNPayDTO dto) {

		VNPayEntity entity = new VNPayEntity();
		entity.setId(dto.getId() != null ? dto.getId().intValue() : null);
		entity.setVnp_TxnRef(dto.getVnp_TxnRef());
		entity.setCodeCart(dto.getCodeCart());
		entity.setAmount(dto.getVnp_Amount());
		entity.setOrderInfo(dto.getVnp_OrderInfo());
		entity.setOrderType(dto.getVnp_OrderType());
		entity.setVnp_TmnCode(dto.getVnp_TmnCode());
		entity.setPayType(dto.getVnp_CardType());
		entity.setTransId(dto.getVnp_TransactionNo());

		return entity;
	}

}
