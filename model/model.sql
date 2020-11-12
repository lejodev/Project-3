DROP DATABASE IF EXISTS DelilahResto;
CREATE DATABASE DelilahResto;
USE DelilahResto;
CREATE TABLE user (
    userId INT(10) NOT NULL AUTO_INCREMENT,
    fullName VARCHAR(100),
    userName VARCHAR(50),
    userPassword VARCHAR(50),
    email VARCHAR(100),
    phone INT(20),
    userAddress VARCHAR(100),
    PRIMARY KEY (userId)
) ENGINE = INNODB;

CREATE TABLE product 
(
    id INT(10) NOT NULL AUTO_INCREMENT,
    name VARCHAR(150),
    price DECIMAL(9,2),
    PRIMARY KEY(id)
) ENGINE = INNODB;

INSERT INTO product(name, price) VALUES
('Hamburguesa vegana',10),
('Caviar ',270),
('Omelette',2.70),
('Paella',120),
('Risotto',77),
('Waffle y helado',12.50)