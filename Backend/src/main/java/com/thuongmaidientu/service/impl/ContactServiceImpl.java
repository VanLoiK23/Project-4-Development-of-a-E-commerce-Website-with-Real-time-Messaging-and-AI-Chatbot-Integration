package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ContactMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ContactDTO;
import com.thuongmaidientu.dto.OrderItem;
import com.thuongmaidientu.dto.RamDTO;
import com.thuongmaidientu.entity.CategoryEntity;
import com.thuongmaidientu.entity.ContactEntity;
import com.thuongmaidientu.entity.DiscountEntity;
import com.thuongmaidientu.entity.RamEntity;
import com.thuongmaidientu.repository.ContactRepository;
import com.thuongmaidientu.repository.RamRepository;
import com.thuongmaidientu.service.ContactService;
import com.thuongmaidientu.service.RamService;

import jakarta.mail.internet.MimeMessage;

@Service
public class ContactServiceImpl implements ContactService {
	@Autowired
	private ContactMapper contactMapper;

	@Autowired
	private ContactRepository contactRepository;

	@Autowired
	private JavaMailSender mailSender;

	@Override
	public List<ContactDTO> findAll(Pageable pageable) {
		List<ContactEntity> entities = contactRepository.findAll(pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	private ContactDTO convertToDTO(ContactEntity entity) {
		return contactMapper.toDTO(entity);
	}

	public ContactEntity convertToEntity(ContactDTO dto) {
		return contactMapper.toEntity(dto);
	}

	@Override
	public void updateStatus(int id, int status, String email, String feeback, String nameClient, String nameSender) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(email);
			helper.setSubject("Phản hồi thắc mắc của khách hàng " + nameClient + "! Từ " + nameSender);

			StringBuilder htmlContent = new StringBuilder();
			htmlContent.append("<div style='font-family:Arial,sans-serif;font-size:14px;'>")
					.append("<h2 style='color:#00BCD4;'>Chào " + nameClient
							+ ",<br><br>Cảm ơn bạn đã liên hệ với chúng tôi!</h2>")
					.append("<h4>Dưới đây là lời phản hồi chúng tôi đưa ra:</h4>").append("<p>").append(feeback)
					.append("</p>").append("<p>Trân trọng,<br>Đội ngũ FPT</p>").append("</div>");

			helper.setText(htmlContent.toString(), true); // true = gửi HTML

			contactRepository.updateStatusById(id, status);

			mailSender.send(message);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	@Override
	public void delete(int id) {
		contactRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) contactRepository.count();

		return (int) (numTotal);
	}

	@Override
	public ContactDTO save(ContactDTO ncc) {
		ContactEntity entity = convertToEntity(ncc);
		ContactEntity savedEntity = contactRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public ContactDTO findById(Integer id) {
		Optional<ContactEntity> entity = contactRepository.findById(Long.valueOf(id));
		return entity.map(this::convertToDTO).orElse(null);
	}

}
