
using ReceiptApp.Application.Abstractions.Messaging;

namespace ReceiptApp.Application.UseCases.Store.Command.CreateStore;

public sealed record CreateStoreCommand(
    string Name,
    string Address
) : ICommand<Guid>;