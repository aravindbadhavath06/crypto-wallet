# 💰 Crypto Wallet

A full-stack digital wallet application built with **Next.js, Spring Boot, and PostgreSQL**.

The application allows users to create an account, authenticate securely using JWT, manage wallet funds, send and receive money, and view their transaction history through a responsive web interface.

> ⚠️ **Note:** This is an educational wallet simulation. It does not perform real cryptocurrency transactions on a blockchain.

---

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Protected wallet APIs
- Secure authenticated sessions

### 💳 Wallet Management
- View wallet balance
- Deposit funds
- Withdraw funds
- Send funds to another registered user
- Receive funds from another user

### 📊 Transactions
- View complete transaction history
- Deposit history
- Withdrawal history
- Send and receive history
- Transaction timestamps
- Transaction amount tracking

### 👤 Profile
- View user information
- View account ID
- Access wallet
- Access transaction history
- Logout

### 📱 Responsive UI
- Desktop responsive design
- Mobile responsive design
- Modern dark-themed interface
- Interactive buttons and forms
- Loading and error feedback

---

# 🏗️ System Architecture

```text
┌──────────────────────────────┐
│        Next.js Frontend      │
│                              │
│  Login • Wallet • Send       │
│  Receive • Transactions      │
│  Profile                     │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│       Spring Boot API        │
│                              │
│ Controllers                  │
│      ↓                       │
│ Services                     │
│      ↓                       │
│ Repositories                 │
└──────────────┬───────────────┘
               │
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
│                              │
│ Users • Wallets              │
│ Transactions                 │
└──────────────────────────────┘