namespace ReceiptApp.Domain.Exceptions.UsersExceptions;

public class UserNameNotFoundException : DomainException
{
    public UserNameNotFoundException(String name) : base($"User with id {name} was not found.") { }
}