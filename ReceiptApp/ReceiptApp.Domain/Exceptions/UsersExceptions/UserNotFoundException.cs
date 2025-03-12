namespace ReceiptApp.Domain.Exceptions.UsersExceptions;

public class UserNotFoundException : DomainException
{
    public UserNotFoundException(Guid id) : base($"User with id {id} was not found.") { }
}