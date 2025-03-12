
using ReceiptApp.Application.Abstractions.Messaging;

namespace ReceiptApp.Application.UseCases.Store.Command.DeleteStore;

public sealed record DeleteStoreCommand(
    Guid StoreId
) : ICommand<Guid>;