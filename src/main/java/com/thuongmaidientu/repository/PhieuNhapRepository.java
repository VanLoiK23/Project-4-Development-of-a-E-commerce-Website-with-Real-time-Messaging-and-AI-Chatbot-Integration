package com.thuongmaidientu.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thuongmaidientu.entity.PhieuNhapEntity;

import jakarta.transaction.Transactional;

public interface PhieuNhapRepository extends JpaRepository<PhieuNhapEntity, Long> {
	List<PhieuNhapEntity> findBySave(String save);

	Page<PhieuNhapEntity> findBySave(String trash, Pageable pageable);

	long countBySave(String save);

	@Modifying
	@Transactional
	@Query("UPDATE PhieuNhapEntity p SET p.save = :trash WHERE p.id = :id")
	int updateSaveById(@Param("id") int id, @Param("trash") String status);

	@Query("SELECT p FROM PhieuNhapEntity p WHERE DATE(p.thoiGian) >= :fromDate  AND p.save='active' ")
	List<PhieuNhapEntity> findAllByDate(@Param("fromDate") Date fromDate, Pageable pageable);

	@Query("SELECT COUNT(p) FROM PhieuNhapEntity p WHERE DATE(p.thoiGian) >= :fromDate  AND p.save='active'")
	int countByDate(@Param("fromDate") Date fromDate);

	@Query(value = "SELECT MONTH(p.thoigian), SUM(p.tongtien) FROM phieunhap p WHERE YEAR(p.thoigian) = YEAR(CURRENT_DATE) GROUP BY MONTH(p.thoigian)", nativeQuery = true)
	List<Object[]> getTongPhieuNhapTheoThang();

	@Query(value = "SELECT QUARTER(thoigian) AS quarter, SUM(tongtien) AS total " + "FROM phieunhap "
			+ "WHERE YEAR(thoigian) = YEAR(CURDATE()) " + "GROUP BY QUARTER(thoigian)", nativeQuery = true)
	List<Object[]> getPhieuNhapTheoQuy();

	// Import Statistic
	@Query(value = "   SELECT CASE  WHEN DAYOFWEEK(thoigian) = 1 THEN 'Chủ nhật'"
			+ "                WHEN DAYOFWEEK(thoigian) = 2 THEN 'Thứ 2'"
			+ "                WHEN DAYOFWEEK(thoigian) = 3 THEN 'Thứ 3'"
			+ "                WHEN DAYOFWEEK(thoigian) = 4 THEN 'Thứ 4'"
			+ "                WHEN DAYOFWEEK(thoigian) = 5 THEN 'Thứ 5'"
			+ "                WHEN DAYOFWEEK(thoigian) = 6 THEN 'Thứ 6'"
			+ "                WHEN DAYOFWEEK(thoigian) = 7 THEN 'Thứ 7' END AS day_of_week, "
			+ "            SUM(tongtien) AS total " + "        FROM phieunhap "
			+ "        WHERE YEARWEEK(thoigian, 1) = YEARWEEK(CURDATE(), 1) "
			+ "        GROUP BY DAYOFWEEK(thoigian)", nativeQuery = true)
	List<Object[]> getImportFinancingStatisticalFollowWeek();

	@Query(value = " SELECT  CASE  WHEN CEIL(DAY(thoigian) / 7) = 1 THEN 'Tuần 1'"
			+ "        WHEN CEIL(DAY(thoigian) / 7) = 2 THEN 'Tuần 2'"
			+ "        WHEN CEIL(DAY(thoigian) / 7) = 3 THEN 'Tuần 3'"
			+ "        WHEN CEIL(DAY(thoigian) / 7) = 4 THEN 'Tuần 4'"
			+ "        WHEN CEIL(DAY(thoigian) / 7) = 5 THEN 'Tuần 5'" + "    END AS week_of_month, "
			+ "    SUM(tongtien) AS total " + "FROM phieunhap " + "WHERE  YEAR(thoigian) = YEAR(CURDATE()) " + "  AND MONTH(thoigian) = MONTH(CURDATE()) "
			+ "GROUP BY CEIL(DAY(thoigian) / 7) " + "ORDER BY CEIL(DAY(thoigian) / 7);", nativeQuery = true)
	List<Object[]> getImportFinancingStatisticalFollowMonth();

	@Query(value = "SELECT QUARTER(thoigian) AS quarter, SUM(tongtien) AS total " + "FROM phieunhap "
			+ "WHERE  YEAR(thoigian) = YEAR(CURDATE()) "
			+ "GROUP BY QUARTER(thoigian)", nativeQuery = true)
	List<Object[]> getImportFinancingStatisticalFollowQuarter();

	@Query(value = """
			SELECT
			    CASE MONTH(thoigian)
			        WHEN 1 THEN 'Tháng 1'
			        WHEN 2 THEN 'Tháng 2'
			        WHEN 3 THEN 'Tháng 3'
			        WHEN 4 THEN 'Tháng 4'
			        WHEN 5 THEN 'Tháng 5'
			        WHEN 6 THEN 'Tháng 6'
			        WHEN 7 THEN 'Tháng 7'
			        WHEN 8 THEN 'Tháng 8'
			        WHEN 9 THEN 'Tháng 9'
			        WHEN 10 THEN 'Tháng 10'
			        WHEN 11 THEN 'Tháng 11'
			        WHEN 12 THEN 'Tháng 12'
			    END AS month_of_year,
			    SUM(tongtien) AS total
			FROM phieunhap
			WHERE  YEAR(thoigian) = YEAR(CURDATE())
			GROUP BY MONTH(thoigian)
			ORDER BY MONTH(thoigian)
			""", nativeQuery = true)
	List<Object[]> getImportFinancingStatisticalFollowYear();

}
