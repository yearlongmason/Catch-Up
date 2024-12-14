DROP DATABASE IF EXISTS catchUpDB;
CREATE DATABASE catchUpDB;
USE catchUpDB;

DROP TABLE IF EXISTS `servers`;
CREATE TABLE IF NOT EXISTS `servers`(
	server_id CHAR(20) NOT NULL,
    server_login CHAR(50),
    PRIMARY KEY (server_id)
);

DROP TABLE IF EXISTS `quotes`;
CREATE TABLE IF NOT EXISTS `quotes`(
	quote_id INT NOT NULL AUTO_INCREMENT,
    server_id CHAR(20) NOT NULL,
    quote TEXT(280),
    author CHAR(30),
    date_quoted DATE,
    PRIMARY KEY (quote_id)
);