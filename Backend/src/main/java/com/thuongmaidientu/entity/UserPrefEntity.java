package com.thuongmaidientu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_pref")
@Getter
@Setter
@NoArgsConstructor
public class UserPrefEntity {

	@EmbeddedId
	private UserPrefId id = new UserPrefId();

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("idUser")
	@JoinColumn(name = "id_user", nullable = false)
	private KhachHangEntity user;

	@Column(name = "weight")
	private Float weight;
}