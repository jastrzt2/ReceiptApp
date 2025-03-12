namespace ReceiptApp.Domain.Exceptions.ReceiptExceptions;

public class ReceiptIdEmptyException : DomainException
{
    public ReceiptIdEmptyException() : base($"Receipt StoreId cannot be empty.") { }
}

public class StoreIdEmptyException : DomainException
{
    public StoreIdEmptyException() : base("Store StoreId cannot be empty.") { }
}

public class TotalPLNInvalidException : DomainException
{
    public TotalPLNInvalidException() : base("Total PLN must be a positive value.") { }
}

public class TotalTaxInvalidException : DomainException
{
    public TotalTaxInvalidException() : base("Total Tax must be a positive value.") { }
}

public class TotalTaxGreaterThanTotalPLNException : DomainException
{
    public TotalTaxGreaterThanTotalPLNException() : base("Total Tax cannot be greater than total PLN.") { }
}

public class PaymentTypeEmptyException : DomainException
{
    public PaymentTypeEmptyException() : base("Payment Type cannot be empty.") { }
}

public class IssuedAtInvalidException : DomainException
{
    public IssuedAtInvalidException() : base("IssuedAt date cannot be in the future.") { }
}

public class ReceiptItemsEmptyException : DomainException
{
    public ReceiptItemsEmptyException() : base("Receipt must contain at least one item.") { }
}

public class PaymentTypeTooLongException : DomainException
{
    public const int MAX_LENGTH = 100;
    public PaymentTypeTooLongException() : base($"PaymentType can't be longer than {MAX_LENGTH}") { }
}

public class CommentTooLongException : DomainException
{
    public const int MAX_LENGTH = 500;
    public CommentTooLongException() : base($"Comment can't be longer than {MAX_LENGTH}") { }
}