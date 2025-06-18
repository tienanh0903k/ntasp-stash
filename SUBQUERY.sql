CREATE TABLE SalesOrderHeader (
    SalesOrderID INT PRIMARY KEY,
    OrderDate DATE,
    CustomerID INT,
    TerritoryID INT,
    SubTotal DECIMAL(18,2)
);
SELECT * FROM SalesOrderHeader
INSERT INTO SalesOrderHeader (SalesOrderID, OrderDate, CustomerID, TerritoryID, SubTotal) VALUES
(1, '2024-06-01', 1001, 1, 100000),
(2, '2024-06-03', 1002, 2, 200000),
(3, '2024-06-03', 1001, 1, 150000),
(4, '2024-06-05', 1003, 1, 220000),
(5, '2024-06-07', 1002, 2, 120000),
(6, '2024-06-07', 1001, 1, 110000),
(7, '2024-06-09', 1004, 2, 210000),
(8, '2024-06-10', 1003, 1, 180000),
(9, '2024-06-11', 1003, 1, 230000),
(10, '2024-06-12', 1005, 2, 190000);



-- “Hãy tìm khách hàng có số lần mua nhiều nhất trong khu vực TerritoryID = 1. 
-- Nếu có nhiều khách cùng đạt max thì liệt kê hết.”


/* MẸO CÓ NÊN GROUP BY HAY KHÔNG ? */
SELECT COUNT(*) FROM SalesOrderHeader
SELECT COUNT(DISTINCT CustomerID) FROM SalesOrderHeader
SELECT 
    COUNT(*) AS SoLuongDong,
    COUNT(DISTINCT CustomerID) AS SoKhachHang
FROM SalesOrderHeader
-- WHERE TerritoryID = 1;




-- B1:Liệt kê từng khách hàng và số lần mua ở TerritoryID = 1
-- SELECT CustomerID, COUNT(*) AS OrderCount
-- FROM SalesOrderHeader
-- WHERE TerritoryID = 1
-- GROUP BY CustomerID;


-- Bài toán con 2:
-- Tìm số lần mua nhiều nhất của một khách hàng ở TerritoryID = 1
-- SELECT MAX(OrderCount) AS maxcount 
-- FROM (
--     SELECT CustomerID, COUNT(*) AS OrderCount
--     FROM SalesOrderHeader 
--     WHERE TerritoryID = 1
--     GROUP BY CustomerID
-- ) as sub;



-- Bài toán con 3:
-- Lấy ra danh sách khách hàng có số lần mua = max

SELECT CustomerID, COUNT(*) AS order_count
FROM SalesOrderHeader  AS S
WHERE S.TerritoryID = 1
GROUP BY CustomerID
HAVING COUNT(*) = (
    SELECT MAX(OrderCount)
    FROM (
        SELECT CustomerID, COUNT(*) AS OrderCount
        FROM SalesOrderHeader
        WHERE TerritoryID = 1
        GROUP BY CustomerID
    ) AS Sub
)






