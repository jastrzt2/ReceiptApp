namespace ReceiptApp.Domain.Exceptions.StoreExceptions;

public class StoreNotFound : DomainException
{
    public StoreNotFound(Guid id) : base($"Store with id {id} was not found.") { }
}