using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.Mappers;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Models.Receipts;
using Shared.Contracts.Receipts.Responses;
using Shared.Contracts.Shared;

namespace ReceiptApp.Application.UseCases.Receipts.Query.GetUserReceipts;

internal sealed class GetUserReceiptsQueryHandler
    : IQueryHandler<GetUserReceiptsQuery, PagedItems<ReceiptResponse>>
{
    private readonly IReceiptReadRepository _receiptRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetUserReceiptsQueryHandler(
        IReceiptReadRepository receiptRepository, 
        IHttpContextAccessor httpContextAccessor)
    {
        _receiptRepository = receiptRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PagedItems<ReceiptResponse>> Handle(
        GetUserReceiptsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            throw new NullReferenceException();
        }
        
        PagedItems<Receipt>? receiptPage = await _receiptRepository.GetUserReceiptByFilterAsync(
            filter: request.Filter,
            userId: userId,
            pageNumber: request.PageNumber,
            pageSize: request.PageSize,
            cancellationToken);
        var responsePage = new PagedItems<ReceiptResponse>
        {
            Items = receiptPage.Items.Select(r => r.MapToResponse()).ToList(),
            TotalCount = receiptPage.TotalCount,
            PageSize = receiptPage.PageSize,
            CurrentPage = receiptPage.CurrentPage
        };

        return responsePage;
    }
}
