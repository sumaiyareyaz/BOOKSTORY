CREATE DATABASE IF NOT EXISTS elibrary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elibrary;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  category VARCHAR(100),
  total_copies INT DEFAULT 1,
  available_copies INT DEFAULT 1,
  file_path VARCHAR(255),
  added_date DATE
);

CREATE TABLE IF NOT EXISTS borrow_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  book_id INT,
  borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE,
  returned_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- sample data
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
('Alice','alice@example.com','[hash]','user'),
('Bob','bob@example.com','[hash]','user'),
('Admin','admin@example.com','[hash]','admin');

INSERT IGNORE INTO books (title, author, category, total_copies, available_copies, added_date) VALUES
('Intro to Java','Author A','Computer Science',3,2,CURDATE()),
('Data Structures','Author B','Computer Science',2,1,CURDATE()),
('World History','Author C','History',4,4,CURDATE()),
('Learn CSS','Author D','Web',2,2,CURDATE()),
('Harry Potter','J. K. Rowling','Fiction',5,0,CURDATE());

INSERT IGNORE INTO borrow_records (user_id, book_id, borrowed_at, due_date, returned_at) VALUES
(1,1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), NULL),
(2,2, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 11 DAY), NULL),
(1,5, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));
