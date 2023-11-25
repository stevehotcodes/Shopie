CREATE TABLE products(
id VARCHAR(200)PRIMARY KEY,
productName VARCHAR (200) NOT NULL,
productDescription VARCHAR(8000) NOT NULL,
price DECIMAL (10,2) NOT NULL,
productImageURL VARCHAR (2000) NOT NULL,
category VARCHAR(200) NOT NULL,
productStock INT DEFAULT 1,
isDeleted INT DEFAULT 0
)