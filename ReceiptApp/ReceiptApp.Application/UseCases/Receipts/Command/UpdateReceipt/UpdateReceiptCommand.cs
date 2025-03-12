
using ReceiptApp.Application.Abstractions.Messaging;

namespace ReceiptApp.Application.UseCases.Receipts.Command.UpdateReceipt;

public sealed record UpdateReceiptCommand(
    Guid ReceiptId,
    Guid? StoreId,
    decimal? TotalPLN,
    decimal? TotalTax,
    string? PaymentType,
    decimal? Change,
    string? Comment,
    DateTime? IssuedAt
) : ICommand<Guid>;