using ReceiptApp.Domain.Enums;

namespace Shared.Contracts.ReceiptItems.Responses;

public record ReceiptItemResponse(
    Guid ReceiptItemId,
    Guid ReceiptId,
    string ProductName,
    int Quantity,
    decimal ProductPrice,
    TaxationType TaxationType,
    ProductCategory ProductCategory,
    DateTime CreatedOnUtc,
    DateTime? ModifiedOnUtc
);
