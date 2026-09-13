package com.example.demo.repository;

import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderOrReceiverOrderByCreatedAtDesc(
            User sender,
            User receiver
    );
}