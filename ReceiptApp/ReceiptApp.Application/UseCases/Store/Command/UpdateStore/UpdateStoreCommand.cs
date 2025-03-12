
using ReceiptApp.Application.Abstractions.Messaging;

namespace ReceiptApp.Application.UseCases.Store.Command.UpdateStore;

public sealed record UpdateStoreCommand(
    Guid StoreId,
    string Name,
    string Address
) : ICommand<Guid>;