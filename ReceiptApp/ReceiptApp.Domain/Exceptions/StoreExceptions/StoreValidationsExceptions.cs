namespace ReceiptApp.Domain.Exceptions.StoreExceptions;

public class StoreIdEmptyException : ValidationException
{
    public StoreIdEmptyException() : base("Store StoreId cannot be empty.") { }
}

public class StoreNameEmptyException : ValidationException
{
    public StoreNameEmptyException() : base("Store name cannot be empty.") { }
}

public class StoreUserIdEmptyException : ValidationException
{
    public StoreUserIdEmptyException() : base("User id cannot be empty.") { }
}

public class StoreUserNullException : ValidationException
{
    public StoreUserNullException() : base("User assigned to store cannot be null.") { }
}

public class StoreNameTooLongException : ValidationException
{
    public const int MAX_LENGTH = 500;
    public StoreNameTooLongException() : base($"StoreName can't be longer than {MAX_LENGTH}") { }
}

public class StoreAddressEmptyException : ValidationException
{
    public StoreAddressEmptyException() : base("Store address cannot be empty.") { }
}

public class StoreAddressTooLongException : ValidationException
{
    public const int MAX_LENGTH = 500;
    public StoreAddressTooLongException() : base($"StoreAddress can't be longer than {MAX_LENGTH}") { }
}