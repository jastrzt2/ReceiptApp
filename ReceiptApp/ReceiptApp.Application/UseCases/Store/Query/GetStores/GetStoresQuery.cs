using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.Shared;
using Shared.Contracts.Stores.Requests;
using Shared.Contracts.Stores.Responses;

namespace ReceiptApp.Application.UseCases.Store.Query.GetStores;

public sealed record GetStoresQuery : IQuery<PagedItems<StoreResponse>>
{
    public StoreFilter Filter { get; init; } = new StoreFilter();
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

