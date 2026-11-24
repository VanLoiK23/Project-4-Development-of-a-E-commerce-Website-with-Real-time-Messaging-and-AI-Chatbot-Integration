package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.UserDTO;
import com.thuongmaidientu.dto.request.ProductRequest;
import com.thuongmaidientu.dto.request.RegisterRequest;
import com.thuongmaidientu.dto.request.UserRequest;
import com.thuongmaidientu.dto.response.UserResponse;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.entity.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserEntity toEntity(UserRequest request);

    UserResponse toResponse(UserEntity entity);

    UserDTO toDTO(UserEntity entity);

    UserEntity toEntity(UserDTO dto);

    UserEntity toEntity(RegisterRequest request);
}
