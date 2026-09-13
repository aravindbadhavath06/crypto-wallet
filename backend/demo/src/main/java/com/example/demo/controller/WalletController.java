package com.example.demo.controller;

import com.example.demo.dto.DepositRequest;
import com.example.demo.dto.WalletResponse;
import com.example.demo.dto.WithdrawRequest;
import com.example.demo.model.User;
import com.example.demo.model.Wallet;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WalletRepository;
import com.example.demo.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.SendRequest;
import com.example.demo.dto.TransactionResponse;
import com.example.demo.model.Transaction;
import java.util.List;
@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:3000")
public class WalletController {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;

    public WalletController(
            WalletRepository walletRepository,
            UserRepository userRepository,
            WalletService walletService) {

        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.walletService = walletService;
    }

    @GetMapping("/me")
    public ResponseEntity<WalletResponse> getMyWallet(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        WalletResponse response = new WalletResponse(
                wallet.getId(),
                wallet.getBalance(),
                user.getId()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit")
    public ResponseEntity<WalletResponse> deposit(
            Authentication authentication,
            @RequestBody DepositRequest request) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Wallet wallet = walletService.deposit(
                user,
                request.getAmount()
        );

        WalletResponse response = new WalletResponse(
                wallet.getId(),
                wallet.getBalance(),
                user.getId()
        );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/withdraw")
public ResponseEntity<WalletResponse> withdraw(
        Authentication authentication,
        @RequestBody WithdrawRequest request) {

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    Wallet wallet = walletService.withdraw(
            user,
            request.getAmount()
    );

    WalletResponse response = new WalletResponse(
            wallet.getId(),
            wallet.getBalance(),
            user.getId()
    );

    return ResponseEntity.ok(response);
}
@PostMapping("/send")
public ResponseEntity<WalletResponse> send(
        Authentication authentication,
        @RequestBody SendRequest request) {

    String email = authentication.getName();

    User sender = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    Wallet wallet = walletService.send(
            sender,
            request.getReceiverEmail(),
            request.getAmount()
    );

    WalletResponse response = new WalletResponse(
            wallet.getId(),
            wallet.getBalance(),
            sender.getId()
    );

    return ResponseEntity.ok(response);
}
@GetMapping("/transactions")
public ResponseEntity<List<TransactionResponse>> getTransactions(
        Authentication authentication) {

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    List<Transaction> transactions =
            walletService.getTransactionHistory(user);

    List<TransactionResponse> response = transactions.stream()
            .map(transaction -> new TransactionResponse(
                    transaction.getId(),
                    transaction.getSender() != null
                            ? transaction.getSender().getEmail()
                            : null,
                    transaction.getReceiver() != null
                            ? transaction.getReceiver().getEmail()
                            : null,
                    transaction.getAmount(),
                    transaction.getType(),
                    transaction.getCreatedAt()
            ))
            .toList();

    return ResponseEntity.ok(response);
}
}