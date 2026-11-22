package com.thuongmaidientu.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.thuongmaidientu.dto.DoanhThuByWeekOrMonthDTO;
import com.thuongmaidientu.dto.OrderByWeekOrMonthDTO;
import com.thuongmaidientu.dto.PhieuXuatDTO;
import com.thuongmaidientu.dto.PnPxByMonthDTO;
import com.thuongmaidientu.dto.PnPxByQuarterDTO;

import org.springframework.data.util.Pair;

public interface IPhieuXuatService {

	PhieuXuatDTO findById(int mapx);
	
	PhieuXuatDTO findById(long mapx);

	PhieuXuatDTO save(PhieuXuatDTO pn);

	List<PhieuXuatDTO> findTrash();

	List<PhieuXuatDTO> findAll(Pageable pageable);

	List<PhieuXuatDTO> selectAll();

	int getTotalItem();

	int getTotalItemTrash();

	void updateTrash(int id, String status);

	void updateStatus(int id, Integer st);

	void updatePaymentStatus(Integer id,String paymentStatus);

	List<PhieuXuatDTO> findAllByDateAndStatusAndStatusPayment(Date fromDate, Integer st, String statusPayment,
			Pageable pageable);

	int getTotalItemByDateAndStatusAndStatusPayment(Date fromDate, Integer st, String statusPayment);

	List<PhieuXuatDTO> getAllOrderByUserID(int userID);

	PhieuXuatDTO getInfoShipping(Integer id);

	void updateStatusCancel(Integer id, String reason);

	Integer getUserIdByOrder(Integer orderId);

	List<OrderByWeekOrMonthDTO> getStatisticalFollowWeek();

	List<OrderByWeekOrMonthDTO> getStatisticalFollowMonth();

	List<DoanhThuByWeekOrMonthDTO> getStatisticalDoanhThuFollowWeek();

	List<DoanhThuByWeekOrMonthDTO> getStatisticalDoanhThuFollowMonth();

	List<String> getRevenueStatisticalByTimeFilter(String timeFilter);

	List<Integer> getOrderStatisticalByTimeFilter(String timeFilter, Integer statusOptinal);
	
	Integer getStatusOrderFollowDoughnutChart(Integer statusOptinal);

	List<Pair<String, Integer>> getTopSellingByTimeFilter(String timeFilter);

	PnPxByMonthDTO getPnPxByMonth();

	PnPxByQuarterDTO getPnPxByQuarter();
	
	List<PhieuXuatDTO> getOrdersForStatiscal();
	
	List<Integer> getHistoryPayemnt(Integer maKH);

}
