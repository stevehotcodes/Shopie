CREATE TABLE products(
id VARCHAR(200)PRIMARY KEY,
productName VARCHAR (200) NOT NULL,
productDescription VARCHAR(8000) NOT NULL,
price INT DEFAULT  0 NOT NULL,
productImageURL VARCHAR (2000) NOT NULL,
category VARCHAR(200) NOT NULL,
productStock INT DEFAULT 1,
isDeleted INT DEFAULT 0
)

SELECT * FROM products
SELECT * FROM users
SELECT * FROM  users

DELETE FROM users
DELETE FROM products
DELETE FROM orders
DELETE FROM sales
DELETE FROM


UPDATE users
SET role='admin'
WHERE firstname='Stephen'