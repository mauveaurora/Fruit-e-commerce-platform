package com.fruitecom.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private List<Long> cartItemIds;
    private Long addressId;
}
