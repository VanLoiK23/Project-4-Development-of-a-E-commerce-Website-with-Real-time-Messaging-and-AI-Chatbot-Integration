package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.UserMapper;

import com.thuongmaidientu.mapper.KhachHangMapper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.KhachHangDTO;
import com.thuongmaidientu.dto.UserDTO;
import com.thuongmaidientu.entity.KhachHangEntity;
import com.thuongmaidientu.entity.UserEntity;
import com.thuongmaidientu.repository.KhachHangRepository;
import com.thuongmaidientu.repository.UserRepository;
import com.thuongmaidientu.service.KhachHangService;

@Service
public class KhachHangServiceImpl implements KhachHangService {
	@Autowired
	private UserMapper userMapper;

	@Autowired
	private KhachHangMapper khachHangMapper;

	@Autowired
	private KhachHangRepository KhachHangRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public List<UserDTO> findAll(Pageable pageable) {
		List<UserEntity> entities = userRepository.findByStatusNotLikeAndRole("deleted", "khách hàng", pageable)
				.getContent();
		return entities.stream().map(this::convertToUserDTO).collect(Collectors.toList());
	}

	@Override
	public List<UserDTO> selectAll() {
		// List<UserEntity> entities = userRepository.findAll();
		List<UserEntity> entities = userRepository.findByStatusNotLike("deleted");

		return entities.stream().map(this::convertToUserDTO).collect(Collectors.toList());
	}

	private KhachHangDTO convertToDTO(KhachHangEntity entity) {
		return khachHangMapper.toDTO(entity);
	}

	public KhachHangEntity convertToEntity(KhachHangDTO dto) {
		return khachHangMapper.toEntity(dto);
	}

	private UserDTO convertToUserDTO(UserEntity entity) {
		UserDTO dto = userMapper.toDTO(entity);
		if (dto == null) {
			return null;
		}
		if (entity.getName() != null) {
			String[] parts = entity.getName().trim().split("\\s+");
			String firstName = "";
			String lastName = "";
			if (parts.length > 0) {
				firstName = parts[parts.length - 1];
				lastName = String.join(" ", Arrays.copyOfRange(parts, 0, parts.length - 1));
			}
			dto.setFirstName(firstName);
			dto.setLastName(lastName);
		}
		return dto;
	}

	public UserEntity convertToUserEntity(UserDTO dto) {
		return userMapper.toEntity(dto);
	}

	@Override
	public void updateStatus(int id, String status) {
		userRepository.updateStatusById(id, status);
	}

	@Override
	public void delete(int id) {
		KhachHangRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public KhachHangDTO findById(int masp) {
		Optional<KhachHangEntity> entity = KhachHangRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) userRepository.countByStatus("active");

		return (int) (numTotal);
	}

	@Override
	public KhachHangDTO save(KhachHangDTO ncc) {

		KhachHangEntity entity = convertToEntity(ncc);
		KhachHangEntity savedEntity = KhachHangRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public UserDTO save(UserDTO ncc) {
		System.out.println(ncc);

		UserEntity entity = convertToUserEntity(ncc);
		UserEntity savedEntity = userRepository.save(entity);
		return convertToUserDTO(savedEntity);
	}

	@Override
	public int getTotalItemTrash() {
		int numTotal = (int) userRepository.countByStatus("deleted");

		return (int) (numTotal);
	}

	@Override
	public List<UserDTO> findTrash() {
		List<UserEntity> entities = userRepository.findByStatus("deleted");
		return entities.stream().map(this::convertToUserDTO).collect(Collectors.toList());
	}

	@Override
	public void update(UserDTO ncc) {
		userRepository.update(ncc.getName(), ncc.getUsername(), ncc.getPhone(), ncc.getEmail(), ncc.getNgaySinh(),
				ncc.getGender(), ncc.getId().intValue());
		KhachHangRepository.update(ncc.getName(), ncc.getGender(), ncc.getNgaySinh(), ncc.getPhone(), ncc.getEmail(),
				ncc.getId().intValue());
	}

	@Override
	public boolean checkIsLockByPhoneOrEmail(String email, String phone) {

		return userRepository.countLockedAccount(email, phone) > 0;
	}

	@Override
	public boolean isExistUserName(String name) {
		return userRepository.existsByNameAllIgnoreCase(name);
	}

	@Override
	public boolean isExistEmail(String email) {
		return userRepository.existsByEmailAllIgnoreCase(email);
	}

	@Override
	public UserDTO findUserDTOById(int id) {
		Optional<UserEntity> entity = userRepository.findById((long) id);
		return entity.map(this::convertToUserDTO).orElse(null);
	}

	@Override
	public UserDTO findByEmail(String email) {
		Optional<UserEntity> user = userRepository.findByEmail(email);
		return convertToUserDTO(user.get());
	}


	@Override
	public Integer getQuantityRegisterByTimeFilter(String timeFilter) {
		return userRepository.getQuantityRegisterByTimeFilter(timeFilter);
	}
}
