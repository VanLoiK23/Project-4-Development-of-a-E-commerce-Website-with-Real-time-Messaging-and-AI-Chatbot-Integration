package com.thuongmaidientu.api.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thuongmaidientu.dto.request.ProductFilterRequest;
import com.thuongmaidientu.dto.response.ArticleResponse;
import com.thuongmaidientu.dto.response.ProductResponse;
import com.thuongmaidientu.dto.response.SlideResponse;
import com.thuongmaidientu.service.ArticleService;
import com.thuongmaidientu.service.ProductService;
import com.thuongmaidientu.service.SlideService;

import lombok.RequiredArgsConstructor;

@RestController("homeController")
@RequiredArgsConstructor
public class HomeController {

	private final ProductService productService;

	private final ArticleService articleService;

	private final SlideService slideService;

	@GetMapping("/api/products")
	public PagedModel<ProductResponse> fetchProducts(@ModelAttribute ProductFilterRequest filter) {
		return new PagedModel<>(productService.getProductsPage(filter));
	}

	@GetMapping("/api/blog")
	public List<ArticleResponse> fetchBlogs(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "3") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createAt") String sortBy) {

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		List<ArticleResponse> blogs = articleService.fetchAritcles(pageable).getContent();

		return new ArrayList<>(blogs);
	}

	@GetMapping("/api/slide")
	public List<SlideResponse> fetchSlides() {
		return new ArrayList<>(slideService.fetchSlides());
	}
}