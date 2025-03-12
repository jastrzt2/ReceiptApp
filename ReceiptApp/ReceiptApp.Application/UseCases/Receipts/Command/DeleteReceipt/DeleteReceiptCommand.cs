
using ReceiptApp.Application.Abstractions.Messaging;

namespace ReceiptApp.Application.UseCases.Receipts.Command.DeleteReceipt;

public sealed record DeleteReceiptCommand(
    Guid ReceiptId
) : ICommand<Guid>;