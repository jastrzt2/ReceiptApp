using ReceiptApp.Domain.Enums;

namespace Shared.Contracts.ReceiptItems.Requests;

public record UpdateReceiptItemRequest(
    Guid? ReceiptId,
    string? ProductName,
    int? Quantity,
    decimal? ProductPrice,
    TaxationType? TaxationType,
    ProductCategory? ProductCategory
);