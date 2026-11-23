package com.thuongmaidientu.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thuongmaidientu.entity.UserEntity;

import jakarta.transaction.Transactional;

import java.util.*;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
	Page<UserEntity> findByStatusNotLikeAndRole(String status, String role, Pageable pageable);

	List<UserEntity> findByStatusNotLike(String status);

	List<UserEntity> findByStatus(String status);

	long countByStatus(String status);

	@Modifying
	@Transactional
	@Query("UPDATE UserEntity p SET p.status = :status WHERE p.id = :id")
	int updateStatusById(@Param("id") int id, @Param("status") String status);

	List<UserEntity> findByUsername(String username);

	@Modifying
	@Transactional
	@Query(value = "UPDATE taikhoan p SET p.name = ?1,p.username=?2,p.phone=?3,p.email=?4,p.ngaysinh=?5,p.gender=?6 WHERE p.id = ?7", nativeQuery = true)
	int update(String name, String username, String phone, String email, Date ngaySinh, String gender, int id);

	@Modifying
	@Transactional
	@Query(value = "UPDATE taikhoan p SET p.name = ?1,p.username=?2,p.phone=?3,p.email=?4,p.ngaysinh=?5,p.role=?6,p.status=?7 WHERE p.id = ?8", nativeQuery = true)
	int updateFromAndroid(String name, String username, String phone, String email, Date ngaySinh, String role,
			String status, int id);

	long countByRole(String role);

	@Query(value = """
			SELECT
			    COUNT(*)
			FROM taikhoan
			WHERE
			   -- 1. Lọc theo Tuần
			   (:timeFilter = 'week' AND YEARWEEK(time_create_acc, 1) = YEARWEEK(CURDATE(), 1))
			   OR
			   -- 2. Lọc theo Tháng
			   (:timeFilter = 'month' AND YEAR(time_create_acc) = YEAR(CURDATE()) AND MONTH(time_create_acc) = MONTH(CURDATE()))
			   OR
			   -- 3. Lọc theo Quý
			   (:timeFilter = 'quarter' AND YEAR(time_create_acc) = YEAR(CURDATE()) AND QUARTER(time_create_acc) = QUARTER(CURDATE()))
			   OR
			   -- 4. Lọc theo Năm
			   (:timeFilter = 'year' AND YEAR(time_create_acc) = YEAR(CURDATE()))
			""", nativeQuery = true)
	Integer getQuantityRegisterByTimeFilter(@Param("timeFilter") String timeFilter);

	boolean existsByNameAllIgnoreCase(String name);

	boolean existsByEmailAllIgnoreCase(String email);

	@Query(value = """
			SELECT COUNT(*) FROM taikhoan WHERE
			(:email IS NULL OR email = :email) AND
			(:phone IS NULL OR phone = :phone) AND
			role='khách hàng' AND status = 'lock'
			""", nativeQuery = true)
	int countLockedAccount(@Param("email") String email, @Param("phone") String phone);

	Optional<UserEntity> findByEmail(String email);

	Optional<UserEntity> findByName(String name);

	boolean existsByEmail(String email);

	boolean existsByName(String name);
}
