package com.thuongmaidientu.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thuongmaidientu.entity.ColorEntity;

import jakarta.transaction.Transactional;

public interface ColorRepository extends JpaRepository<ColorEntity, Long> {

	Page<ColorEntity> findByTrash(String trash, Pageable pageable);
	
	List<ColorEntity> findByTrash(String trash);

	long countByTrash(String trash);

	@Query("SELECT p.maMauSac FROM ColorEntity p WHERE p.tenMauSac = :color")
	Integer selectIdByValue(@Param("color") String color);

	@Modifying
	@Transactional
	@Query("UPDATE ColorEntity p SET p.status = :status WHERE p.maMauSac = :id")
	int updateStatusById(@Param("id") int id, @Param("status") int status);

	@Modifying
	@Transactional
	@Query("UPDATE ColorEntity p SET p.trash = :trash WHERE p.maMauSac = :id")
	int updateTrashById(@Param("id") int id, @Param("trash") String status);
	
	Integer findMaMauSacByTenMauSac(String color);
	
	List<ColorEntity> findByTenMauSacContaining(String keyword);
	
	boolean existsByTenMauSac(String color);
	
	Long countByTenMauSac(String color);

	List<ColorEntity> findByTenMauSacOrderByMaMauSacDesc(String color);

	ColorEntity findTopByOrderByMaMauSacDesc();



}
