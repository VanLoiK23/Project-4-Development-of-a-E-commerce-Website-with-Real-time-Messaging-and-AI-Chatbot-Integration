package com.thuongmaidientu.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thuongmaidientu.entity.ProductItemFeatureEntity;
import com.thuongmaidientu.entity.ProductItemFeatureId;

public interface ProductItemFeatureRepository extends JpaRepository<ProductItemFeatureEntity, ProductItemFeatureId> {

	@Query("""
			SELECT f FROM ProductItemFeatureEntity f
			WHERE f.id.idSp IN :ids
			  AND LOWER(f.id.config) LIKE 'smooth_tau0.6_%'
			""")
	List<ProductItemFeatureEntity> findSmoothByProductIds(@Param("ids") Collection<Integer> ids);
}