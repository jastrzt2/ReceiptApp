using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Domain.Enums;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Command.UpdateReceiptItem;

public sealed record UpdateReceiptItemCommand(
    Guid ReceiptItemId,
    Guid? ReceiptId,
    string? ProductName,
    int? Quantity,
    decimal? ProductPrice,
    TaxationType? TaxationType,
    ProductCategory? ProductCategory
) : ICommand<Guid>;