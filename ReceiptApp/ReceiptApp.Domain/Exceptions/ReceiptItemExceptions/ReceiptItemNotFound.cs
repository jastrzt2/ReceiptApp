namespace ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;

public class ReceiptItemNotFound : DomainException
{
    public ReceiptItemNotFound(Guid id) : base($"ReceiptItem with id {id} was not found.") { }
}