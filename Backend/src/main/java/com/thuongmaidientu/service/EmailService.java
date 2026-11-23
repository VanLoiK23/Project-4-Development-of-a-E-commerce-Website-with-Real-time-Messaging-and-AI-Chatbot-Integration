package com.thuongmaidientu.service;

import java.util.List;

import com.thuongmaidientu.dto.OrderItem;

public interface EmailService {

	boolean sendOTPEmail(String toEmail, String OTP);

	boolean sendResetEmail(String toEmail, String token);

	void sendOrderEmail(String toEmail, List<OrderItem> orderItems, Integer total);
}
