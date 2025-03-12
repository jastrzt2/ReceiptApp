
using ReceiptApp.Application.Abstractions.Messaging;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Command.DeleteReceiptItem;

public sealed record DeleteReceiptItemCommand(
    Guid ReceiptItemId
) : ICommand<Guid>;