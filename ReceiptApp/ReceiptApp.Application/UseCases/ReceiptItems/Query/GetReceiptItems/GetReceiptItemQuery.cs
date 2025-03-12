using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.ReceiptItems.Requests;
using Shared.Contracts.ReceiptItems.Responses;
using Shared.Contracts.Shared;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Query.GetReceiptItems;

public sealed record GetReceiptItemQuery : IQuery<PagedItems<ReceiptItemResponse>>
{
    public ReceiptItemFilter Filter { get; init; } = new ReceiptItemFilter();
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

