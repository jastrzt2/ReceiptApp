namespace ReceiptApp.Domain.Exceptions.ReceiptExceptions;

public class ReceiptNotFound : DomainException
{
    public ReceiptNotFound(Guid id) : base($"Receipt with id {id} was not found.") { }
}