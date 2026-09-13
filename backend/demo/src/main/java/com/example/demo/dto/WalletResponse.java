package com.example.demo.dto;

import java.math.BigDecimal;

public class WalletResponse {

    private Long id;
    private BigDecimal balance;
    private Long userId;

    public WalletResponse() {
    }

    public WalletResponse(Long id, BigDecimal balance, Long userId) {
        this.id = id;
        this.balance = balance;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}