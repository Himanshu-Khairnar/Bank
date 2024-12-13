CREATE DATABASE Bank;
USE Bank;

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL ,
    Role ENUM('user', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL ,
    transaction_type ENUM('deposit', 'withdrawal') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL ,
    balance DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE

);