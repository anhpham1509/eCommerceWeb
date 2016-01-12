/*
** Target DBMS:           MySQL 5
** Project name:          aStore
** Author:                Anh Pham
** Created on:            2015-12-04 15:30
*/
DROP DATABASE IF EXISTS aStore;

CREATE DATABASE IF NOT EXISTS aStore;

USE aStore;

/*
** Tables
*/

/*
** Add table "Categories"
*/

CREATE TABLE `Categories` (
  `CategoryID`   INTEGER     NOT NULL AUTO_INCREMENT,
  `CategoryName` VARCHAR(58) NOT NULL,
  `Description`  MEDIUMTEXT,
  `CategorySlug` VARCHAR(68) NOT NULL,
  `Image`        VARCHAR(58) NOT NULL,
  CONSTRAINT `PK_Categories` PRIMARY KEY (`CategoryID`)
);

CREATE INDEX `CategoryName` ON `Categories` (`CategoryName`);

/*
** Add table "Users"
*/

CREATE TABLE `Users` (
  `UserID`        INTEGER      NOT NULL AUTO_INCREMENT,
  `FullName`      VARCHAR(50)  NOT NULL,
  `StreetAddress` VARCHAR(255) NOT NULL,
  `PostCode`      VARCHAR(5)   NOT NULL,
  `City`          VARCHAR(28)  NOT NULL,
  `Country`       VARCHAR(28)  NOT NULL,
  `Phone`         VARCHAR(12)  NOT NULL,
  `Email`         VARCHAR(50)  NOT NULL,
  `Username`      VARCHAR(28),
  `Password`      VARCHAR(158),
  `Admin`         BOOLEAN      NOT NULL DEFAULT 0,
  CONSTRAINT `PK_Users` PRIMARY KEY (`UserID`)
);

CREATE INDEX `Username` ON `Users` (`Username`);

/*
** Add table "Addresses"
*/

CREATE TABLE `Addresses` (
  `AddressID`     INTEGER      NOT NULL AUTO_INCREMENT,
  `UserID`        INTEGER,
  `FullName`      VARCHAR(50)  NOT NULL,
  `StreetAddress` VARCHAR(255) NOT NULL,
  `PostCode`      VARCHAR(5)   NOT NULL,
  `City`          VARCHAR(28)  NOT NULL,
  `Country`       VARCHAR(28)  NOT NULL,
  `Phone`         VARCHAR(12)  NOT NULL,
  CONSTRAINT `PK_Addresses` PRIMARY KEY (`AddressID`),
  CONSTRAINT `FK_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
);

/*
** Add table "Products"
*/

CREATE TABLE `Products` (
  `ProductID`       INTEGER      NOT NULL AUTO_INCREMENT,
  `ProductName`     VARCHAR(40)  NOT NULL,
  `CategoryID`      INTEGER,
  `ProductPrice`    DECIMAL(10, 2)        DEFAULT 0,
  `UnitsInStock`    SMALLINT(5)           DEFAULT 0,
  `Description`     VARCHAR(255) NOT NULL,
  `ManufactureYear` SMALLINT(5)  NOT NULL,
  `Image`           VARCHAR(50)  NOT NULL,
  `ProductSlug`     VARCHAR(50)  NOT NULL,
  `Feature`         BOOLEAN      NOT NULL DEFAULT 0,
  CONSTRAINT `PK_Products` PRIMARY KEY (`ProductID`),
  CONSTRAINT `FK_Products_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`) ON DELETE CASCADE
);

CREATE INDEX `ProductName` ON `Products` (`ProductName`);

/*
** Add table "Orders"
*/

CREATE TABLE `Orders` (
  `OrderID`   INTEGER NOT NULL AUTO_INCREMENT,
  `UserID`    INTEGER NOT NULL,
  `AddressID` INTEGER NOT NULL,
  `SubTotal`  DECIMAL(10,2),
  `Discount`  DECIMAL(10,2),
  `ShippingFee`  DECIMAL(10,2),
  `Total`  DECIMAL(10,2),
  `OrderDate` DATETIME,
  `Status`    VARCHAR(150) NOT NULL,
  CONSTRAINT `PK_Orders` PRIMARY KEY (`OrderID`),
  CONSTRAINT `FK_Orders_Users` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
);

/*
** Add table "Order Details"
*/

CREATE TABLE `Order Details` (
  `OrderID`   INTEGER     NOT NULL,
  `ProductID` INTEGER     NOT NULL,
  `Quantity`  SMALLINT(2) NOT NULL DEFAULT 1,
  `Total`     DECIMAL(10,2) NOT NULL,
  CONSTRAINT `PK_Order Details` PRIMARY KEY (`OrderID`, `ProductID`),
  CONSTRAINT `FK_Order_Details_Orders` FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Order_Details_Products` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`) ON DELETE CASCADE
);

/*
** Add table "Messages"
*/

CREATE TABLE `Messages` (
  `MessageID` INTEGER     NOT NULL AUTO_INCREMENT,
  `FullName`  VARCHAR(50) NOT NULL,
  `Email`     VARCHAR(50) NOT NULL,
  `Subject`   VARCHAR(128),
  `Content`   VARCHAR(158),
  CONSTRAINT `PK_Messages` PRIMARY KEY (`MessageID`)
);

/*
** Add table "Subscribers"
*/

CREATE TABLE `Subscribers` (
  `Email` VARCHAR(50)  NOT NULL
);

/*
** Data
*/

/*
** Add data into "Categories"
*/

INSERT INTO Categories
VALUES (NULL, 'Smartphone', 'Mobile phones', 'smartphone', 'smartphone.png');
INSERT INTO Categories
VALUES (NULL, 'TV', 'TVs', 'tv', 'tv.png');
INSERT INTO Categories
VALUES (NULL, 'Computers', 'Computers', 'computers', 'computers.png');
INSERT INTO Categories
VALUES (NULL, 'Game Console', 'Game Consoles', 'game-console', 'game-console.png');
INSERT INTO Categories
VALUES (NULL, 'Networks', 'Networks', 'networks', 'networks.png');
INSERT INTO Categories
VALUES (NULL, 'Software', 'Software', 'software', 'software.png');
INSERT INTO Categories
VALUES (NULL, 'Camera', 'Cameras', 'camera', 'camera.png');
INSERT INTO Categories
VALUES (NULL, 'Cables', 'Cables', 'cables', 'cables.png');

/*
** Add data into "Products"
*/

INSERT INTO Products
VALUES (NULL, 'iPhone 6', 1, 850.52, 18, 'Lateast', 2015, '1.png', 'iphone-6', 1);
INSERT INTO Products
VALUES (NULL, 'iPhone 5S', 1, 500.22, 15, 'Newer', 2014, '2.png', 'iphone-5s', 0);
INSERT INTO Products
VALUES (NULL, 'Sony 40 inches', 2, 600.56, 10, 'Sony Full HD', 2013, '3.png', 'sony-40-inches', 1);
INSERT INTO Products
VALUES (NULL, 'Samsung 32 inches', 2, 350.89, 12, 'Samsung LED', 2012, '4.png', 'samsung-32-inches', 0);
INSERT INTO Products
VALUES (NULL, 'Lenovo PC', 3, 1000.99, 8, 'Intel-NVIDA-Logitech', 2011, '5.png', 'lenovo-pc', 0);
INSERT INTO Products
VALUES (NULL, 'Macbook Pro', 3, 2300.89, 6, 'Apple Early 2010', 2010, '6.png', 'macbook-pro', 1);
INSERT INTO Products
VALUES (NULL, 'XBOX Five', 4, 600.88, 12, 'Microsoft Future', 2009, '7.png', 'xbox-five', 0);
INSERT INTO Products
VALUES (NULL, 'PlayStation 6', 4, 522.99, 15, 'Sony Tomorrow', 2008, '8.png', 'playstation-6', 1);
INSERT INTO Products
VALUES (NULL, 'Linksys 123', 5, 200.55, 16, 'Modem ADSL 8+', 2001, '9.png', 'linksys-123', 1);
INSERT INTO Products
VALUES (NULL, 'Netgear 456', 5, 43.33, 22, 'Router Full Speed', 2005, '10.png', 'netgear-456', 0);
INSERT INTO Products
VALUES (NULL, 'Adobe Photoshop CC', 6, 120.89, 17, 'Adobe Power', 2018, '11.png', 'adobe-photoshop-cc', 1);
INSERT INTO Products
VALUES (NULL, 'Canon 2222D', 7, 1209.59, 16, 'Canon Powerful 3D', 2019, '12.png', 'canon-2222d', 1);
INSERT INTO Products
VALUES (NULL, 'HDMI 5.0', 8, 5.88, 14, 'HDMI High Speed Standard', 2002, '13.png', 'hdmi-5.0', 1);

/*
** Add data into "Customers"
*/

INSERT INTO Users
VALUES (NULL, 'Admin', 'Vanha Maantie 6', '02650', 'Espoo', 'Finland', '0123456789', 'admin@astore.com', 'admin', '$2a$10$mpJCYlSr762SwQVzdLwxR.KgRuWEHA2NzUanxxG/nxEStDRcRBbB6', 1);
INSERT INTO Users
VALUES
  (NULL, 'Anh Pham', 'Vanha Maantie 8', '02650', 'Helsinki', 'Finland', '012 345 6787', 'anh.pham@astore.com', 'anhpham', '$2a$10$TsD7IW0m1g/57C931nC7R.FjwXw9i0tAbJZk7u4Uk0gDoneR9yBim',
   0);

/*
** Add data into "Addresses"
*/
INSERT INTO Addresses
VALUES (NULL, 1, 'Admin', 'Vanha Maantie 6', '02650', 'Espoo', 'Finland', '0123456789');
INSERT INTO Addresses
VALUES (NULL, 2, 'Anh Pham', 'Vanha Maantie 8', '02650', 'Helsinki', 'Finland', '012 345 6787');