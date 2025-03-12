using Shared.Contracts.Shared;

namespace Shared.Contracts.Receipts.Requests;

public record ReceiptFilter : AuditableFilter
{
    public Guid? StoreId { get; init; }
    public decimal? MinTotalPLN { get; init; }
    public decimal? MaxTotalPLN { get; init; }
    public decimal? MinTotalTax { get; init; }
    public decimal? MaxTotalTax { get; init; }
    public string? PaymentType { get; init; }
    public DateTime? StartIssuedAt { get; init; }
    public DateTime? EndIssuedAt { get; init; }
    public string? Comment { get; init; }
}
