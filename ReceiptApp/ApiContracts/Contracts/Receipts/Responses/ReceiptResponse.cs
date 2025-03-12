namespace Shared.Contracts.Receipts.Responses;

public record ReceiptResponse(
    Guid ReceiptId,
    string UserId,
    Guid? StoreId,
    decimal TotalPLN,
    decimal TotalTax,
    string PaymentType,
    decimal Change,
    string? Comment,
    DateTime IssuedAt,
    DateTime CreatedAt,
    DateTime? ModifiedAt
);
