package com.thuongmaidientu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vn_pay")
@Getter
@Setter
@NoArgsConstructor
public class VNPayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "vnp_tmncode", nullable = false, length = 50)
    private String vnp_TmnCode;

    @Column(name = "vnp_txnref", nullable = false)
    private Long vnp_TxnRef;

    @Column(name = "vnp_amount", nullable = false, length = 50)
    private String amount;

    @Column(name = "vnp_orderinfo", nullable = false, length = 100)
    private String orderInfo;

    @Column(name = "vnp_ordertype", nullable = false, length = 50)
    private String orderType;

    @Column(name = "vnp_transactionno", nullable = false)
    private Long transId;

    @Column(name = "vnp_cardtype", nullable = false, length = 50)
    private String payType;

    @Column(name = "code_cart", nullable = false, length = 50)
    private String codeCart;
}
