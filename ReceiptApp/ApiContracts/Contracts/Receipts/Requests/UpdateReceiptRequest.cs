

namespace Shared.Contracts.Receipts.Requests;

public record UpdateReceiptRequest(
    Guid? StoreId,
    decimal? TotalPLN,
    decimal? TotalTax,
    string? PaymentType,
    decimal? Change,
    string? Comment,
    DateTime? IssuedAt
);