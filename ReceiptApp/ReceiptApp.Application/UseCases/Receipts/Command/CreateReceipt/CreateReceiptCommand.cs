
using ReceiptApp.Application.Abstractions.Messaging;

namespace ReceiptApp.Application.UseCases.Receipts.Command.CreateReceipt;

public sealed record CreateReceiptCommand(
    Guid? StoreId,
    decimal TotalPLN,
    decimal TotalTax,
    string PaymentType,
    decimal Change,
    string? Comment,
    DateTime IssuedAt
) : ICommand<Guid>;