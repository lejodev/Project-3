DROP DATABASE IF EXISTS DelilahResto;
CREATE DATABASE DelilahResto;
USE DelilahResto;

-- Table that stores application´s users
CREATE TABLE user (
    id INT(10) NOT NULL AUTO_INCREMENT,
    fullName VARCHAR(100),
    userName VARCHAR(50),
    password VARCHAR(50),
    email VARCHAR(100),
    phone BIGINT(20),
    address VARCHAR(100),
    isAdmin BOOLEAN,
    PRIMARY KEY (id)
) ENGINE = INNODB;

-- Table that stores restaurant´s products
CREATE TABLE product 
(
    id INT(10) NOT NULL AUTO_INCREMENT,
    name VARCHAR(150),
    price DECIMAL(9,2),
    PRIMARY KEY(id)
) ENGINE = INNODB;

-- Table of orders performed by the restaurant´s users
CREATE TABLE `order` 
(
    id INT(10) NOT NULL AUTO_INCREMENT,
    userId INT(10) NOT NULL,
    status ENUM('new', 'confirmed', 'preparing', 'sending', 'cancelled', 'delivered'),
    hour TIME,
    paymentMethod ENUM('cash', 'credit card', 'bitcoin'),
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES user(id)
) ENGINE = INNODB;

-- Intermediate table between product and order
CREATE TABLE map_order_product 
(
    id INT(10) NOT NULL AUTO_INCREMENT,
    orderId INT(10),
    productId INT(10),
    amount INT(10),
    total DECIMAL(9,2),
    PRIMARY KEY (id),
    FOREIGN KEY(orderId) REFERENCES `order`(id),
    FOREIGN KEY(productId) REFERENCES product(id)
) ENGINE = INNODB;

INSERT INTO product(name, price) VALUES
('Hamburguesa vegana',10),
('Caviar ',270),
('Omelette',2.70),
('Paella',120),
('Risotto',77),
('Waffle y helado',12.50)