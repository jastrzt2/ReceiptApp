using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.Mappers;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Models.ReceiptItems;
using Shared.Contracts.ReceiptItems.Responses;
using Shared.Contracts.Shared;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Query.GetReceiptItems;

internal sealed class GetReceiptItemQueryHandler
    : IQueryHandler<GetReceiptItemQuery, PagedItems<ReceiptItemResponse>>
{
    private readonly IReceiptItemReadRepository _receiptItemRepository;
    private readonly IReceiptReadRepository _receiptRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetReceiptItemQueryHandler(
        IReceiptItemReadRepository receiptItemRepository, 
        IReceiptReadRepository receiptRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _receiptItemRepository = receiptItemRepository;
        _receiptRepository = receiptRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PagedItems<ReceiptItemResponse>> Handle(
        GetReceiptItemQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            throw new NullReferenceException();
        }

        PagedItems<ReceiptItem>? receiptPage = await _receiptItemRepository.GetReceiptItemByFilterAsync(
            filter: request.Filter,
            userId: userId,
            pageNumber: request.PageNumber,
            pageSize: request.PageSize,
            cancellationToken);

        var responsePage = new PagedItems<ReceiptItemResponse>
        {
            Items = receiptPage.Items.Select(ri => ri.MapToResponse()).ToList(),
            TotalCount = receiptPage.TotalCount,
            PageSize = receiptPage.PageSize,
            CurrentPage = receiptPage.CurrentPage
        };

        return responsePage;
    }
}
