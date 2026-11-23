package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ProductMapper;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.CategoryDTO;
import com.thuongmaidientu.dto.KhuVucKhoDTO;
import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.dto.ThongKeSellingProductDTO;
import com.thuongmaidientu.dto.XuatXuDTO;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.repository.ProductRepository;
import com.thuongmaidientu.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
	@Autowired
	private ProductMapper productMapper;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private PhienbansanphamServiceImpl phienbansanphamService;

	@Autowired
	private CartServiceImpl cartService;

	@Autowired
	private ChitietPNServiceImpl chitietPNService;

	@Autowired
	private ChitietPXServiceImpl chitietPXService;

	@Autowired
	private ChitietSPServiceImpl chitietSPService;

	@Autowired
	private CommentAndRateServiceImpl commentAndRateService;

	@Autowired
	private XuatxuServiceImpl xuatxuRepository;

	@Autowired
	private KhuVucKhoServiceImpl khoRepository;

	@Autowired
	private CategoryServiceImpl brandRepository;

	@Override
	public List<ProductDTO> findAll(Pageable pageable) {
		/*
		 * List<ProductEntity> entities =
		 * productRepository.findAll(pageable).getContent(); return
		 * entities.stream().map(this::convertToDTO).collect(Collectors.toList());
		 */

		List<ProductEntity> entities = productRepository.findByTrash("active", pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public ProductDTO save(ProductDTO sanphammoi) {
		ProductEntity entity = convertToEntity(sanphammoi);
		ProductEntity savedEntity = productRepository.save(entity);
		return convertToDTO(savedEntity);
	}

	@Override
	public int getTotalItem() {
		int numTotal = (int) productRepository.count();
		int numTrash = (int) productRepository.countByTrash("disable");

		return (int) (numTotal - numTrash);
	}

	@Override
	public int getTotalItemTrash() {
		return (int) productRepository.countByTrash("disable");
	}

	// Convert Entity -> DTO
	public ProductDTO convertToDTO(ProductEntity entity) {
		ProductDTO dto = productMapper.toDTO(entity);
		if (dto == null) {
			return null;
		}

		// Compatibility fields for Web / Admin
		dto.setDungLuongPin(dto.getBatteryMah());
		dto.setManHinh(dto.getScreenInch() != null ? dto.getScreenInch() + " inch" : null);
		dto.setHeDieuHanh(dto.getOs() != null ? dto.getOs() : "Không có hệ điều hành");
		dto.setCameraSau(dto.getRearMainMp() != null ? dto.getRearMainMp() + " MP" : null);

		if (entity.getSoLuongNhap() != null && entity.getSoLuongBan() != null) {
			dto.setSoLuongCon(entity.getSoLuongNhap() - entity.getSoLuongBan());
		}
		dto.setCreatedDate(entity.getCreated());
		if (entity.getListPhienBanSP() != null) {
			dto.setPbspList(entity.getListPhienBanSP().stream().map(phienbansanphamService::convertToDTO)
					.collect(Collectors.toList()));
		}

		return dto;
	}

	// Convert DTO -> Entity
	public ProductEntity convertToEntity(ProductDTO dto) {
		ProductEntity entity = productMapper.toEntity(dto);
		if (entity == null) {
			return null;
		}

		Date date = new Date();

		if (dto.getXuatXuId() != null) {
			XuatXuDTO xx = xuatxuRepository.findById(dto.getXuatXuId());
			if (xx != null) {
				entity.setXuatXu(xuatxuRepository.convertToEntity(xx));
			}
		}
		if (dto.getThuongHieuId() != null) {
			CategoryDTO k = brandRepository.findById(dto.getThuongHieuId());
			if (k != null) {
				entity.setThuongHieu(brandRepository.convertToEntity(k));
			}
		}
		if (dto.getKhuVucKhoId() != null) {
			KhuVucKhoDTO k = khoRepository.findById(dto.getKhuVucKhoId());
			if (k != null) {
				entity.setKhuVucKho(khoRepository.convertToEntity(k));
			}
		}

		// Fallback từ các trường cũ nếu specs chưa có
		java.util.Map<String, Object> specs = entity.getSpecs() != null ? new java.util.HashMap<>(entity.getSpecs()) : new java.util.HashMap<>();
		if (!specs.containsKey("battery_mah") && dto.getDungLuongPin() != null) {
			specs.put("battery_mah", dto.getDungLuongPin());
		}
		if (!specs.containsKey("os") && dto.getHeDieuHanh() != null) {
			specs.put("os", dto.getHeDieuHanh());
		}
		entity.setSpecs(specs);

		entity.setModified(date);
		entity.setModifiedBy("Huy");
		entity.setCreated(date);
		entity.setCreatedBy("Huy");

		if (dto.getStatus() == null) {
			entity.setStatus(1);
		} else {
			entity.setStatus(dto.getStatus());
		}

		return entity;
	}

	@Override
	public void updateStatus(int id, int status) {
		productRepository.updateStatusById(id, status);
	}

	@Override
	public void updateTrash(int id, String trash) {
		productRepository.updateTrashById(id, trash);
	}

	@Override
	public void delete(int id) {
		List<PhienBanSanPhamDTO> phienBanSanPhamDTOs = phienbansanphamService.findAll(id);

		phienBanSanPhamDTOs.forEach(pb -> {
			cartService.deleteCart(pb.getMaPhienbansanpham().intValue());
			chitietSPService.deleteCTSP(pb.getMaPhienbansanpham().intValue());

			chitietPNService.deletePN(pb.getMaPhienbansanpham().intValue());
			chitietPXService.deletePX(pb.getMaPhienbansanpham().intValue());
			commentAndRateService.deleteComment(id);

			phienbansanphamService.deletePhienBanSP(pb.getMaPhienbansanpham().intValue());
		});

		productRepository.deleteById(Long.valueOf(id));
	}

	@Override
	public ProductDTO findById(int masp) {
		Optional<ProductEntity> entity = productRepository.findById((long) masp);
		return entity.map(this::convertToDTO).orElse(null);
	}

	@Override
	public List<ProductDTO> searchLikeName(String name) {
		List<ProductEntity> entities = productRepository.searchByName(name);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public boolean checkExistTenSanPham(String tensp) {
		return productRepository.existsByTenSanPhamAllIgnoreCase(tensp);
	}

	@Override
	public String selectImages(Integer masp) {
		return productRepository.findHinhAnhById(masp);
	}

	@Override
	public void updateSLProduct(Integer Nhap, Integer Ban, Integer masp) {

		productRepository.updateSLProduct(Nhap, Ban, Long.valueOf(masp));

	}

	@Override
	public List<ProductDTO> findTrash() {
		List<ProductEntity> entities = productRepository.findByTrash("disable");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ProductDTO> getALlProducts() {
		List<ProductEntity> entities = productRepository.findByTrash("active");
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ProductDTO> findByKho(Integer makv) {
		List<ProductEntity> entities = productRepository.getListSPFromKho(makv);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<Object[]> findChiTietPhienBanSanPhamByPhieuNhap(Integer mapb, Integer mapn) {
		return productRepository.findChiTietPhienBanSanPhamByPhieuNhap(mapb, mapn);
	}

	@Override
	public List<Object[]> findChiTietPhienBanSanPhamByPhieuXuat(Integer mapb, Integer mapx) {
		return productRepository.findChiTietPhienBanSanPhamByPhieuXuat(mapb, mapx);
	}

	@Override
	public ProductDTO findProductByIDtosForAndroid(Integer mapb) {

		List<Object[]> results = productRepository.findInfoSP(mapb);

		ProductDTO dto = new ProductDTO();

		for (Object[] record : results) {

			dto.setTenSanPham((String) record[0]);
			dto.setKichThuocRam((Integer) record[1]);
			dto.setKichThuocRom((Integer) record[2]);
			dto.setColor((String) record[3]);
			dto.setHinhAnh((String) record[4]);
			dto.setMap((Integer) record[5]);
			;

		}

		return dto;
	}

	@Override
	public void updateReviewProductAll(Integer total, Double totalRate, Long masp) {
		productRepository.updateReviewAllProduct(total, totalRate, masp);
	}

	@Override
	public void updateReviewProduct(Integer total, Double totalRate, Long masp) {
		productRepository.updateReviewProduct(total, totalRate, masp);
	}

	@Override
	public List<ThongKeSellingProductDTO> getTopSellingProduct() {
		List<Object[]> results = productRepository.getStatisticalBuySellingProduct();

		List<ThongKeSellingProductDTO> thongKeSellingProductDTOs = new ArrayList<>();

		for (Object[] record : results) {
			ThongKeSellingProductDTO dto = new ThongKeSellingProductDTO();
			dto.setName((String) record[0]);
			dto.setSoluongban(((Number) record[1]).intValue());

			thongKeSellingProductDTOs.add(dto);
		}

		return thongKeSellingProductDTOs;
	}

	@Override
	public List<ProductDTO> getProductDTOByHighlight(String highlight, Boolean isFull) {
		List<ProductEntity> entities = isFull
				? productRepository.getProductByHighlight(highlight, Pageable.unpaged()).getContent()
				: productRepository.getProductByHighlight(highlight, PageRequest.of(0, 5)).getContent();

		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ProductDTO> getProductDTO_TopRated(Integer minRate, Boolean isFull) {

		List<ProductEntity> entities = isFull
				? productRepository.getProductTopRate(minRate, Pageable.unpaged()).getContent()
				: productRepository.getProductTopRate(minRate, PageRequest.of(0, 5)).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ProductDTO> getProductDTOUnder2M(Boolean isFull) {
		List<ProductEntity> entities = isFull
				? productRepository.findProductsWithPriceSaleUnder2Million(Pageable.unpaged()).getContent()
				: productRepository.findProductsWithPriceSaleUnder2Million(PageRequest.of(0, 5)).getContent();

		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public List<ProductDTO> getProductDTO_NewRelease(Boolean isFull) {
		List<ProductEntity> entities = isFull
				? productRepository.getProductNewlyReleasedWithinTwoWeeks(Pageable.unpaged()).getContent()
				: productRepository.getProductNewlyReleasedWithinTwoWeeks(PageRequest.of(0, 5)).getContent();

		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public ProductDTO getDetailProductDTOByAlias(String alias, Integer idPBSP) {
		List<Object[]> results = productRepository.findProductByAlias(alias, idPBSP);

		ProductDTO dto = new ProductDTO();

		for (Object[] record : results) {

			dto.setKichThuocRam((Integer) record[0]);
			dto.setKichThuocRom((Integer) record[1]);
			dto.setColor((String) record[2]);
			dto.setGiaXuat(((Number) record[3]).doubleValue());
			dto.setPriceSale(((Number) record[4]).doubleValue());
		}

		return dto;
	}

	@Override
	public List<String> findByAlphabet(String keyword) {
		return productRepository.findListProductByAlphabet("%" + keyword + "%");
	}

	@Override
	public List<ProductDTO> filterProducts(String promo, Integer star, Double minPrice, Double maxPrice,
			Integer company, String search, Pageable pageable) {
		List<ProductEntity> entities = productRepository
				.findAllByOptionalFilters(promo, star, minPrice, maxPrice, company, search, pageable).getContent();
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public Integer countFilterProducts(String promo, Integer star, Double minPrice, Double maxPrice, Integer company,
			String search) {
		Long totalCount = productRepository.countFilteredProducts(promo, star, minPrice, maxPrice, company, search);
		return totalCount.intValue();
	}

	@Override
	public List<ProductDTO> findByAlias(String alias) {
		List<ProductEntity> entities = productRepository.findByAlias(alias);
		return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public ProductDTO getProductByIdVersionProduct(Integer maPB) {
		List<ProductEntity> productEntities = productRepository.findProductByIdVersionProduct(maPB);

		return (productEntities != null) ? convertToDTO(productEntities.get(0)) : null;
	}

	
	@Override
	public ProductDTO findInfoProductForOrderInWeb(Integer maPB) {

		List<Object[]> results = productRepository.findInfoProductForOrderInWeb(maPB);

		ProductDTO dto = new ProductDTO();

		for (Object[] record : results) {

			dto.setTenSanPham((String) record[0]);
			dto.setKichThuocRam((Integer) record[1]);
			dto.setKichThuocRom((Integer) record[2]);
			dto.setColor((String) record[3]);
			dto.setHinhAnh((String) record[4]);
			dto.setMap((Integer) record[5]);;
			dto.setSortDesc((String) record[6]);;
			dto.setGiaXuat(((Number) record[7]).doubleValue());;
			dto.setPriceSale(((Number) record[8]).doubleValue());;

		}

		return dto;
	}
}
