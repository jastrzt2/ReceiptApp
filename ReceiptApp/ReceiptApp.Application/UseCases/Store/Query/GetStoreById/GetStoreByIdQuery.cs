using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.Stores.Responses;

namespace ReceiptApp.Application.UseCases.Store.Query.GetStoreById;

public sealed record GetStoreByIdQuery
(Guid StoreId) : IQuery<StoreResponse>;
