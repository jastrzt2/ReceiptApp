namespace ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;
public class ReceiptItemIdEmptyException : ValidationException
{
    public ReceiptItemIdEmptyException() : base("Receipt Item StoreId cannot be empty.") { }
}

public class ProductNameEmptyException : ValidationException
{
    public ProductNameEmptyException() : base("Product name cannot be empty.") { }
}

public class ProductNameTooLongException : ValidationException
{
    public const int MAX_LENGTH = 100;
    public ProductNameTooLongException() : base($"ProductName can't be longer than {MAX_LENGTH}") { }
}

public class QuantityInvalidException : ValidationException
{
    public QuantityInvalidException() : base("Quantity must be greater than zero.") { }
}

public class ProductPriceInvalidException : ValidationException
{
    public ProductPriceInvalidException() : base("Product price cannot be negative.") { }
}

