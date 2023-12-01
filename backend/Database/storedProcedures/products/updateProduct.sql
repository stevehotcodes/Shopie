CREATE OR ALTER PROCEDURE updateProduct(
    @id VARCHAR(200),
    @productName VARCHAR(200),
    @productDescription VARCHAR(200),
    @price DECIMAL,
    @productImageURL VARCHAR(8000),
    @category VARCHAR(200),
    @productStock INT
)
AS
BEGIN 
    UPDATE products
    SET productName=@productName,productDescription=@productDescription,price=@price,@productImageURL=@productImageURL,category=@category,productStock=@productStock
    WHERE id=@id
END