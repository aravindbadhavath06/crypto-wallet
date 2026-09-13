package com.example.demo.service;

import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.model.Wallet;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(
            WalletRepository walletRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository) {

        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public Wallet createWallet(User user) {

        if (walletRepository.existsByUser(user)) {
            throw new RuntimeException("Wallet already exists");
        }

        Wallet wallet = new Wallet(user, BigDecimal.ZERO);

        return walletRepository.save(wallet);
    }

    @Transactional
    public Wallet deposit(User user, BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Deposit amount must be greater than zero"
            );
        }

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        wallet.setBalance(
                wallet.getBalance().add(amount)
        );

        Wallet savedWallet = walletRepository.save(wallet);

        Transaction transaction = new Transaction(
                null,
                user,
                amount,
                "DEPOSIT"
        );

        transactionRepository.save(transaction);

        return savedWallet;
    }

    @Transactional
    public Wallet withdraw(User user, BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Withdrawal amount must be greater than zero"
            );
        }

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        wallet.setBalance(
                wallet.getBalance().subtract(amount)
        );

        Wallet savedWallet = walletRepository.save(wallet);

        Transaction transaction = new Transaction(
                user,
                null,
                amount,
                "WITHDRAW"
        );

        transactionRepository.save(transaction);

        return savedWallet;
    }

    @Transactional
    public Wallet send(
            User sender,
            String receiverEmail,
            BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Send amount must be greater than zero"
            );
        }

        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "You cannot send money to yourself"
            );
        }

        Wallet senderWallet = walletRepository.findByUser(sender)
                .orElseThrow(() ->
                        new RuntimeException("Sender wallet not found"));

        Wallet receiverWallet = walletRepository.findByUser(receiver)
                .orElseThrow(() ->
                        new RuntimeException("Receiver wallet not found"));

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        senderWallet.setBalance(
                senderWallet.getBalance().subtract(amount)
        );

        receiverWallet.setBalance(
                receiverWallet.getBalance().add(amount)
        );

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Transaction transaction = new Transaction(
                sender,
                receiver,
                amount,
                "SEND"
        );

        transactionRepository.save(transaction);

        return senderWallet;
    }
    public java.util.List<Transaction> getTransactionHistory(User user) {

    return transactionRepository
            .findBySenderOrReceiverOrderByCreatedAtDesc(user, user);
}
}