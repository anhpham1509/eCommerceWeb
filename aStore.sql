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
    `CategoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoryName` VARCHAR(58) NOT NULL,
    `Description` MEDIUMTEXT,
    `CategorySlug` VARCHAR(68) NOT NULL,
    `ImageLink` VARCHAR(58) NOT NULL,
    CONSTRAINT `PK_Categories` PRIMARY KEY (`CategoryID`)
);

CREATE INDEX `CategoryName` ON `Categories` (`CategoryName`);

	/*
	** Add table "Users"
	*/

CREATE TABLE `Users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `FullName` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `StreetAddress` VARCHAR(255) NOT NULL,
    `PostCode` VARCHAR(5) NOT NULL,
    `City` VARCHAR(28) NOT NULL,
    `Country` VARCHAR(28) NOT NULL,
    `Phone` VARCHAR(12) NOT NULL,
    `Username` VARCHAR(28),
    `PasswordHash` VARCHAR(158),
    `Admin` BIT NOT NULL DEFAULT 0,
    CONSTRAINT `PK_Users` PRIMARY KEY (`UserID`)
);

CREATE INDEX `Username` ON `Users` (`Username`);

	/*
	** Add table "Products"
	*/

CREATE TABLE `Products` (
    `ProductID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductName` VARCHAR(40) NOT NULL,
    `CategoryID` INTEGER,
    `ProductPrice` DECIMAL(10,2) DEFAULT 0,
    `UnitsInStock` SMALLINT(5) DEFAULT 0,
    `UnitsOnOrder` SMALLINT(5) DEFAULT 0,
    `Description` VARCHAR(255) NOT NULL,
    `ManufactureYear` SMALLINT(5) NOT NULL,
    `ImageLink` VARCHAR(50) NOT NULL,
    `ProductSlug` VARCHAR(50) NOT NULL,
    `Feature` BIT NOT NULL DEFAULT 0,
    CONSTRAINT `PK_Products` PRIMARY KEY (`ProductID`),
    CONSTRAINT `FK_Products_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`)
);

CREATE INDEX `ProductName` ON `Products` (`ProductName`);

	/*
	** Add table "Orders"
	*/
    
CREATE TABLE `Orders` (
    `OrderID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `AddressID` INTEGER NOT NULL,
    `OrderDate` DATETIME,
    `DeliveryAddress` VARCHAR(255),
    CONSTRAINT `PK_Orders` PRIMARY KEY (`OrderID`),
    CONSTRAINT `FK_Orders_Users` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
);

	/*
	** Add table "Order Details"
	*/

CREATE TABLE `Order Details` (
    `OrderID` INTEGER NOT NULL,
    `ProductID` INTEGER NOT NULL,
    `ProductPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `Quantity` SMALLINT(2) NOT NULL DEFAULT 1,
    CONSTRAINT `PK_Order Details` PRIMARY KEY (`OrderID`, `ProductID`),
    CONSTRAINT `FK_Order_Details_Orders` FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`),
    CONSTRAINT `FK_Order_Details_Products` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`)
);


/*
** Data
*/

	/*
	** Add data into "Categories"
	*/

INSERT INTO Categories
VALUES(null,'Smartphone','Mobile phones','smartphone','img/categories/smartphone.png');
INSERT INTO Categories
VALUES(null,'TV','TVs','tv','/img/categories/tv.png');
INSERT INTO Categories
VALUES(null,'Computers','Computers','computers','/img/categories/computers.png');
INSERT INTO Categories
VALUES(null,'Game Console','Game Consoles','game-console','/img/categories/game-console.png');
INSERT INTO Categories
VALUES(null,'Networks','Networks','networks','/img/categories/networks.png');
INSERT INTO Categories
VALUES(null,'Software','Software','software','/img/categories/software.png');
INSERT INTO Categories
VALUES(null,'Camera','Cameras','camera','/img/categories/camera.png');
INSERT INTO Categories
VALUES(null,'Cables','Cables','cables','/img/categories/cables.png');

	/*
	** Add data into "Products"
	*/

INSERT INTO Products
VALUES(null, 'iPhone 6', 1, 850.52, 18, 7, 'Lateast', 2015, '/img/products/1.png', 'iphone-6', 1);
INSERT INTO Products
VALUES(null, 'iPhone 5S', 1, 500.22, 15, 4, 'Newer', 2014, '/img/products/2.png', 'iphone-5s', 0);
INSERT INTO Products
VALUES(null, 'Sony 40 inches', 2, 600.56, 10, 5, 'Sony Full HD', 2013, '/img/products/3.png', 'sony-40-inches', 1);
INSERT INTO Products
VALUES(null, 'Samsung 32 inches', 2, 350.89, 12, 9, 'Samsung LED', 2012, '/img/products/4.png', 'samsung-32-inches', 0);
INSERT INTO Products
VALUES(null, 'Lenovo PC', 3, 1000.99, 8, 5, 'Intel-NVIDA-Logitech', 2011, '/img/products/5.png', 'lenovo-pc', 0);
INSERT INTO Products
VALUES(null, 'Macbook Pro', 3, 2300.89, 6, 2, 'Apple Early 2010', 2010, '/img/products/6.png', 'macbook-pro', 1);
INSERT INTO Products
VALUES(null, 'XBOX Five', 4, 600.88, 12, 1, 'Microsoft Future', 2009, '/img/products/7.png', 'xbox-five', 0);
INSERT INTO Products
VALUES(null, 'PlayStation 6', 4, 522.99, 15, 2, 'Sony Tomorrow', 2008, '/img/products/8.png', 'playstation-6', 1);
INSERT INTO Products
VALUES(null, 'Linksys 123', 5, 200.55, 16, 6, 'Modem ADSL 8+', 2001, '/img/products/9.png', 'linksys-123', 1);
INSERT INTO Products
VALUES(null, 'Netgear 456', 5, 43.33, 22, 2, 'Router Full Speed', 2005, '/img/products/10.png', 'netgear-456', 0);
INSERT INTO Products
VALUES(null, 'Adobe Photoshop CC', 6, 120.89, 17, 8, 'Adobe Power', 2018, '/img/products/11.png', 'adobe-photoshop-cc', 1);
INSERT INTO Products
VALUES(null, 'Canon 2222D', 7, 1209.59, 16, 9, 'Canon Powerful 3D', 2019, '/img/products/12.png', 'canon-2222d', 1);
INSERT INTO Products
VALUES(null, 'HDMI 5.0', 8, 5.88, 14, 10, 'HDMI High Speed Standard', 2002, '/img/products/13.png', 'hdmi-5.0', 1);

	/*
	** Add data into "Customers"
	*/

INSERT INTO Users
VALUES(null, 'Admin', 'admin@astore.com', 'Admin', '02680', 'Espoo', 'Finland', '012 345 6789', 'admin', 'admin', 1);
INSERT INTO Users
VALUES(null, 'Ana Trujillo', 'ana.trujillo@astore.com', 'Lintukorventie 2', '02660', 'Espoo', 'Finland', '012 345 6788', 'alfreds', 'alfreds', 0);
INSERT INTO Users
VALUES(null, 'Thomas Hardy', 'thomas.hardy@astore.com', 'Vanha Maantie 2', '02650', 'Helsinki', 'Finland', '012 345 6787', 'thomas', 'thomas', 0);
INSERT INTO Users
VALUES(null, 'Yang Wang', 'yang.wang@astore.com', 'Rautatienkatu 2', '02640', 'Porvoo', 'Finland', '012 345 6786', 'yang', 'yang', 0);
INSERT INTO Users
VALUES(null, 'Sven Ottlieb', 'sven.ottlieb@astore.com', 'Kham Thien 2', '02630', 'Hanoi', 'Vietnam', '012 345 6785', 'sven', 'sven', 0);

	/*
	** Add data into "Orders"
	*/

INSERT INTO Orders
VALUES (null, 2, 1, '2015-12-01 00:00:00.000', '2 Lintukorventie, Oulu, 12345, Vietnam');
INSERT INTO Orders
VALUES (null, 2, 1, '2015-12-02 00:00:00.000', '8 Vieraskuja, Kuopio, 23456, Hongkong');
INSERT INTO Orders
VALUES (null, 3, 1, '2015-12-03 00:00:00.000', '1 Siltakuja, Espoo, 34567, China');
INSERT INTO Orders
VALUES (null, 4, 1, '2015-12-04 00:00:00.000', '21 Metsantie, Helsinki, 45678, Japan');
INSERT INTO Orders
VALUES (null, 3, 1, '2015-12-05 00:00:00.000', '17 Helsigintie, Porvoo, 56789, Finland');

	/*
	** Add data into "Order Details"
	*/

INSERT INTO `Order Details`
VALUES (1, 1, 850.52, 1);
INSERT INTO `Order Details`
VALUES (2, 2, 500.22, 1);
INSERT INTO `Order Details`
VALUES (2, 6, 2300.89, 1);
INSERT INTO `Order Details`
VALUES (3, 4, 350.89, 1);
INSERT INTO `Order Details`
VALUES (4, 5, 1000.99, 1);
INSERT INTO `Order Details`
VALUES (5, 7, 600.88, 1);
INSERT INTO `Order Details`
VALUES (1, 8, 522.99, 1);
INSERT INTO `Order Details`
VALUES (3, 9, 200.55, 1);


/*
**	Add View "Product List"
*/

CREATE VIEW `Product List`
AS
SELECT Products.*, CategoryName, CategorySlug
FROM Categories 
   INNER JOIN Products ON Categories.CategoryID = Products.CategoryID
WHERE (Products.UnitsInStock > 0);

# ---------------------------------------------------------------------- #
# Add View "Invoices"                                                    #
# ---------------------------------------------------------------------- #

CREATE VIEW `Invoices`
AS
SELECT Orders.ShipName,
       Orders.ShipAddress,
       Orders.ShipCity,
       Orders.ShipRegion, 
       Orders.ShipPostalCode,
       Orders.ShipCountry,
       Orders.CustomerID,
       Customers.CompanyName AS CustomerName, 
       Customers.Address,
       Customers.City,
       Customers.Region,
       Customers.PostalCode,
       Customers.Country,
       (Employees.FirstName + ' ' + Employees.LastName) AS Salesperson, 
       Orders.OrderID,
       Orders.OrderDate,
       Orders.RequiredDate,
       Orders.ShippedDate, 
       Shippers.CompanyName As ShipperName,
       `Order Details`.ProductID,
       Products.ProductName, 
       `Order Details`.UnitPrice,
       `Order Details`.Quantity,
       `Order Details`.Discount, 
       (((`Order Details`.UnitPrice*Quantity*(1-Discount))/100)*100) AS ExtendedPrice,
       Orders.Freight 
FROM Customers 
  JOIN Orders ON Customers.CustomerID = Orders.CustomerID  
    JOIN Employees ON Employees.EmployeeID = Orders.EmployeeID    
     JOIN `Order Details` ON Orders.OrderID = `Order Details`.OrderID     
      JOIN Products ON Products.ProductID = `Order Details`.ProductID      
       JOIN Shippers ON Shippers.ShipperID = Orders.ShipVia;

# ---------------------------------------------------------------------- #
# Add View "Orders Qry"                                                  #
# ---------------------------------------------------------------------- #
	   
CREATE VIEW `Orders Qry` AS
SELECT Orders.OrderID,
       Orders.CustomerID,
       Orders.EmployeeID, 
       Orders.OrderDate, 
       Orders.RequiredDate,
       Orders.ShippedDate, 
       Orders.ShipVia, 
       Orders.Freight,
       Orders.ShipName, 
       Orders.ShipAddress, 
       Orders.ShipCity,
       Orders.ShipRegion,
       Orders.ShipPostalCode,
       Orders.ShipCountry,
       Customers.CompanyName,
       Customers.Address,
       Customers.City,
       Customers.Region,
       Customers.PostalCode, 
       Customers.Country
FROM Customers 
     JOIN Orders ON Customers.CustomerID = Orders.CustomerID;     

# ---------------------------------------------------------------------- #
# Add View "Order Subtotals"                                             #
# ---------------------------------------------------------------------- #
	 
CREATE VIEW `Order Subtotals` AS
SELECT `Order Details`.OrderID, 
Sum((`Order Details`.UnitPrice*Quantity*(1-Discount)/100)*100) AS Subtotal
FROM `Order Details`
GROUP BY `Order Details`.OrderID;

# ---------------------------------------------------------------------- #
# Add View "Products by Category"                                        #
# ---------------------------------------------------------------------- #

CREATE VIEW `Products by Category` AS
SELECT Categories.CategoryName, 
       Products.ProductName,
       Products.UnitsInStock
FROM Categories 
     INNER JOIN Products ON Categories.CategoryID = Products.CategoryID
WHERE Products.Discontinued <> 1;

# ---------------------------------------------------------------------- #
# Add View "Sales Totals by Amount"                                      #
# ---------------------------------------------------------------------- #

CREATE VIEW `Sales Totals by Amount` AS
SELECT `Order Subtotals`.Subtotal AS SaleAmount, 
                  Orders.OrderID, 
               Customers.CompanyName, 
                  Orders.ShippedDate
FROM Customers 
 JOIN Orders ON Customers.CustomerID = Orders.CustomerID
    JOIN `Order Subtotals` ON Orders.OrderID = `Order Subtotals`.OrderID 
WHERE (`Order Subtotals`.Subtotal >2500) 
AND (Orders.ShippedDate BETWEEN '1997-01-01' And '1997-12-31');


# ---------------------------------------------------------------------- #
# Add View "Order Details Extended"                                      #
# ---------------------------------------------------------------------- #

CREATE VIEW `Order Details Extended` AS
SELECT `Order Details`.OrderID, 
       `Order Details`.ProductID, 
       Products.ProductName, 
	   `Order Details`.UnitPrice, 
       `Order Details`.Quantity, 
       `Order Details`.Discount, 
      (`Order Details`.UnitPrice*Quantity*(1-Discount)/100)*100 AS ExtendedPrice
FROM Products 
     JOIN `Order Details` ON Products.ProductID = `Order Details`.ProductID;

# ---------------------------------------------------------------------- #
# Add View "Sales by Category"                                           #
# ---------------------------------------------------------------------- #

CREATE VIEW `Sales by Category` AS
SELECT Categories.CategoryID, 
       Categories.CategoryName, 
         Products.ProductName, 
	Sum(`Order Details Extended`.ExtendedPrice) AS ProductSales
FROM  Categories 
    JOIN Products 
      ON Categories.CategoryID = Products.CategoryID
       JOIN `Order Details Extended` 
         ON Products.ProductID = `Order Details Extended`.ProductID                
           JOIN Orders 
             ON Orders.OrderID = `Order Details Extended`.OrderID 
WHERE Orders.OrderDate BETWEEN '1997-01-01' And '1997-12-31'
GROUP BY Categories.CategoryID, Categories.CategoryName, Products.ProductName;

# ---------------------------------------------------------------------- #
# Add Procedure "CustOrderHist"                                          #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `CustOrderHist`;

DELIMITER $$

CREATE PROCEDURE `CustOrderHist`(in AtCustomerID varchar(5))
BEGIN

SELECT ProductName,
    SUM(Quantity) as TOTAL
FROM Products P,
     `Order Details` OD,
     Orders O,
     Customers C
WHERE C.CustomerID = AtCustomerID
  AND C.CustomerID = O.CustomerID
  AND O.OrderID = OD.OrderID
  AND OD.ProductID = P.ProductID
GROUP BY ProductName;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "CustOrdersOrders"                                       #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `CustOrdersOrders`;

DELIMITER $$

CREATE PROCEDURE `CustOrdersOrders`(in AtCustomerID varchar(5))
BEGIN
      SELECT OrderID,
	OrderDate,
	RequiredDate,
	ShippedDate
FROM Orders
WHERE CustomerID = AtCustomerID
ORDER BY OrderID;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "Employee Sales by Country"                              #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `Employee Sales by Country`;

DELIMITER $$

CREATE PROCEDURE `Employee Sales by Country`(in AtBeginning_Date Datetime,in AtEnding_Date Datetime)
BEGIN
  SELECT Employees.Country,
         Employees.LastName,
         Employees.FirstName,
            Orders.ShippedDate,
            Orders.OrderID,
 `Order Subtotals`.Subtotal AS SaleAmount
FROM Employees
 JOIN Orders ON Employees.EmployeeID = Orders.EmployeeID
      JOIN `Order Subtotals` ON Orders.OrderID = `Order Subtotals`.OrderID
WHERE Orders.ShippedDate Between AtBeginning_Date And AtEnding_Date;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "Employee Sales by Year"                                 #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `Sales by Year`;

DELIMITER $$

CREATE PROCEDURE `Sales by Year`(in AtBeginning_Date Datetime,in AtEnding_Date Datetime)
BEGIN

    SELECT Orders.ShippedDate,
	   Orders.OrderID,
	  `Order Subtotals`.Subtotal,
	  ShippedDate AS Year
FROM Orders  JOIN `Order Subtotals` ON Orders.OrderID = `Order Subtotals`.OrderID
WHERE Orders.ShippedDate Between AtBeginning_Date And AtEnding_Date;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "SalesByCategory"                                        #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `SalesByCategory`;
DELIMITER $$

CREATE PROCEDURE `SalesByCategory`()
BEGIN

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "sp_Employees_Insert"                                    #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `sp_Employees_Insert`;

DELIMITER $$

CREATE PROCEDURE `sp_Employees_Insert`(
In AtLastName VARCHAR(20),
In AtFirstName VARCHAR(10),
In AtTitle VARCHAR(30),
In AtTitleOfCourtesy VARCHAR(25),
In AtBirthDate DateTime,
In AtHireDate DateTime,
In AtAddress VARCHAR(60),
In AtCity VARCHAR(15),
In AtRegion VARCHAR(15),
In AtPostalCode VARCHAR(10),
In AtCountry VARCHAR(15),
In AtHomePhone VARCHAR(24),
In AtExtension VARCHAR(4),
In AtPhoto LONGBLOB,
In AtNotes MEDIUMTEXT,
In AtReportsTo INTEGER,
IN AtPhotoPath VARCHAR(255),
OUT AtReturnID INTEGER
)
BEGIN
Insert Into Employees Values(AtLastName,AtFirstName,AtTitle,AtTitleOfCourtesy,AtBirthDate,AtHireDate,AtAddress,AtCity,AtRegion,AtPostalCode,AtCountry,AtHomePhone,AtExtension,AtPhoto,AtNotes,AtReportsTo,AtPhotoPath);

	SELECT AtReturnID = LAST_INSERT_ID();
	
END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "sp_Employees_SelectAll"                                 #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `sp_Employees_SelectAll`;

DELIMITER $$

CREATE PROCEDURE `sp_Employees_SelectAll`()
BEGIN
SELECT * FROM Employees;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "sp_Employees_SelectRow"                                 #
# ---------------------------------------------------------------------- #


DROP PROCEDURE IF EXISTS `sp_Employees_SelectRow`;

DELIMITER $$

CREATE PROCEDURE `sp_Employees_SelectRow`(In AtEmployeeID INTEGER)
BEGIN
SELECT * FROM Employees Where EmployeeID = AtEmployeeID;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add Procedure "sp_Employees_Update"                                    #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `sp_Employees_Update`;

DELIMITER $$

CREATE PROCEDURE `sp_Employees_Update`(
In AtEmployeeID INTEGER,
In AtLastName VARCHAR(20),
In AtFirstName VARCHAR(10),
In AtTitle VARCHAR(30),
In AtTitleOfCourtesy VARCHAR(25),
In AtBirthDate DateTime,
In AtHireDate DateTime,
In AtAddress VARCHAR(60),
In AtCity VARCHAR(15),
In AtRegion VARCHAR(15),
In AtPostalCode VARCHAR(10),
In AtCountry VARCHAR(15),
In AtHomePhone VARCHAR(24),
In AtExtension VARCHAR(4),
In AtPhoto LONGBLOB,
In AtNotes MEDIUMTEXT,
In AtReportsTo INTEGER,
IN AtPhotoPath VARCHAR(255)
)
BEGIN
Update Employees
	Set
		LastName = AtLastName,
		FirstName = AtFirstName,
		Title = AtTitle,
		TitleOfCourtesy = AtTitleOfCourtesy,
		BirthDate = AtBirthDate,
		HireDate = AtHireDate,
		Address = AtAddress,
		City = AtCity,
		Region = AtRegion,
		PostalCode = AtPostalCode,
		Country = AtCountry,
		HomePhone = AtHomePhone,
		Extension = AtExtension,
		Photo = AtPhoto,
		Notes = AtNotes,
		ReportsTo = AtReportsTo,
    PhotoPath = AtPhotoPath
	Where
		EmployeeID = AtEmployeeID;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add FUNCTION "MyRound"                                                 #
# ---------------------------------------------------------------------- #

DROP FUNCTION IF EXISTS `MyRound`;

DELIMITER $$

CREATE FUNCTION `MyRound`(Operand DOUBLE,Places INTEGER) RETURNS DOUBLE
DETERMINISTIC
BEGIN

DECLARE x DOUBLE;
DECLARE i INTEGER;
DECLARE ix DOUBLE;

  SET x = Operand*POW(10,Places);
  SET i=x;
  
  IF (i-x) >= 0.5 THEN                   
    SET ix = 1;                  
  ELSE
    SET ix = 0;                 
  END IF;     

  SET x=i+ix;
  SET x=x/POW(10,Places);

RETURN x;


END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add PROCEDURE "LookByFName"                                            #
# ---------------------------------------------------------------------- #

DROP PROCEDURE IF EXISTS `LookByFName`;

DELIMITER $$

CREATE PROCEDURE `LookByFName`(IN AtFirstLetter CHAR(1))
BEGIN
     SELECT * FROM Employees  Where LEFT(FirstName, 1)=AtFirstLetter;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add FUNCTION "DateOnly"                                                #
# ---------------------------------------------------------------------- #

DELIMITER $$

DROP FUNCTION IF EXISTS `DateOnly` $$

CREATE FUNCTION `DateOnly` (InDateTime datetime) RETURNS VARCHAR(10)
BEGIN

  DECLARE MyOutput varchar(10);
	SET MyOutput = DATE_FORMAT(InDateTime,'%Y-%m-%d');

  RETURN MyOutput;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add PROCEDURE  "sp_employees_cursor" CURSOR SAMPLE                     #
# ---------------------------------------------------------------------- #
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_employees_cursor` $$
CREATE PROCEDURE `sp_employees_cursor`(IN city_in VARCHAR(15))
BEGIN
  DECLARE name_val VARCHAR(10);
  DECLARE surname_val VARCHAR(10);
  DECLARE photopath_val VARCHAR(255);

  DECLARE no_more_rows BOOLEAN;

  DECLARE fetch_status INT DEFAULT 0;

  DECLARE employees_cur CURSOR FOR SELECT firstname, lastname,photopath FROM employees WHERE city = city_in;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET no_more_rows = TRUE;

  DROP TABLE IF EXISTS atpeople;
  CREATE TABLE atpeople(
    FirstName VARCHAR(10),
    LastName VARCHAR(20),
    PhotoPath VARCHAR(255)
  );


  OPEN employees_cur;
  select FOUND_ROWS() into fetch_status;


  the_loop: LOOP

    FETCH  employees_cur  INTO   name_val,surname_val,photopath_val;


    IF no_more_rows THEN
       CLOSE employees_cur;
       LEAVE the_loop;
    END IF;


    INSERT INTO atpeople SELECT  name_val,surname_val,photopath_val;

  END LOOP the_loop;

  SELECT * FROM atpeople;
  DROP TABLE atpeople;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add PROCEDURE  "sp_employees_rownum" rownum SAMPLE                     #
# ---------------------------------------------------------------------- #
  
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_employees_rownum`$$
CREATE PROCEDURE `sp_employees_rownum` ()
BEGIN

SELECT *
FROM
(select @rownum:=@rownum+1  as RowNum,
  p.* from employees p
   ,(SELECT @rownum:=0) R
   order by firstname desc limit 10
) a
WHERE a.RowNum >= 2 AND a.RowNum<= 4;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add PROCEDURE  "sp_employees_rollup" rollup SAMPLE                     #
# ---------------------------------------------------------------------- #
  
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_employees_rollup`$$
CREATE PROCEDURE `sp_employees_rollup` ()
BEGIN
SELECT Distinct City ,Sum(Salary) Salary_By_City FROM employees
GROUP BY City WITH ROLLUP;

END $$

DELIMITER ;

# ---------------------------------------------------------------------- #
# Add PROCEDURE  "sp_employees_rank" rank SAMPLE                         #
# ---------------------------------------------------------------------- #

DELIMITER $$

DROP PROCEDURE IF EXISTS `northwind`.`sp_employees_rank` $$
CREATE PROCEDURE `northwind`.`sp_employees_rank` ()
BEGIN
select *
     from (select a.Title, a.EmployeeID, a.FirstName, a.Salary,
                  (select 1 + count(*)
                   from Employees b
                   where b.Title = a.Title
                     and b.Salary > a.Salary) RANK
           from Employees as a) as x
     order by x.Title, x.RANK;

END $$

DELIMITER ;