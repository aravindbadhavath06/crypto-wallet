package com.example.demo.dto;

import java.math.BigDecimal;

public class SendRequest {

    private String receiverEmail;
    private BigDecimal amount;

    public SendRequest() {
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}