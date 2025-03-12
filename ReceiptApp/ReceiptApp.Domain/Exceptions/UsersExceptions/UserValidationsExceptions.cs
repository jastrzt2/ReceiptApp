namespace ReceiptApp.Domain.Exceptions.UsersExceptions;

public class UserIdEmptyException : DomainException
{
    public UserIdEmptyException() : base($"User StoreId cannot be empty.") { }
}
