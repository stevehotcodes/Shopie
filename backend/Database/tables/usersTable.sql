CREATE TABLE users(
customer_id VARCHAR(200) PRIMARY KEY,
firstname VARCHAR(100) NOT NULL,
lastname VARCHAR(100) NOT NULL,
email VARCHAR(200) UNIQUE NOT NULL,
role VARCHAR(100) DEFAULT 'user',
isDeleted INT DEFAULT 0,
password VARCHAR(200) NOT NULL
);

drop table users
