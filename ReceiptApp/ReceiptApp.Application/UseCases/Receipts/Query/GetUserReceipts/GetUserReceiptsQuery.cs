using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.Receipts.Requests;
using Shared.Contracts.Receipts.Responses;
using Shared.Contracts.Shared;

namespace ReceiptApp.Application.UseCases.Receipts.Query.GetUserReceipts;

public sealed record GetUserReceiptsQuery : IQuery<PagedItems<ReceiptResponse>>
{
    public ReceiptFilter Filter { get; init; } = new ReceiptFilter();
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

