package com.thuongmaidientu.exception;

public class RefreshTokenNotFoundException extends RuntimeException {

	public RefreshTokenNotFoundException() {
		super("Refresh token không tồn tại hoặc đã hết hạn");
	}
}
