using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Domain.Enums;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Command.CreateReceiptItem;

public sealed record CreateReceiptItemCommand(
    Guid ReceiptId,
    string ProductName,
    int Quantity,
    decimal ProductPrice,
    TaxationType TaxationType,
    ProductCategory ProductCategory
) : ICommand<Guid>;