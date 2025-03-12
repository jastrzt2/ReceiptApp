namespace ReceiptApp.Domain.Exceptions.StatisticsException;

public class BadMonthRequest : DomainException
{
    public BadMonthRequest() : base("Month must be between 1 and 12") { }
}