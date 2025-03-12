using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.Mappers;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;
using Shared.Contracts.ReceiptItems.Responses;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Query.GetReceiptItemById;

internal sealed class GetReceiptItemByIdQueryHandler
    : IQueryHandler<GetReceiptItemByIdQuery, ReceiptItemResponse>
{
    private readonly IReceiptItemReadRepository _receiptItemRepository;
    private readonly IReceiptReadRepository _receiptRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetReceiptItemByIdQueryHandler(IReceiptItemReadRepository receiptItemRepository, IReceiptReadRepository receiptRepository, IHttpContextAccessor httpContextAccessor)
    {
        _receiptItemRepository = receiptItemRepository;
        _receiptRepository = receiptRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ReceiptItemResponse> Handle(
        GetReceiptItemByIdQuery request,
        CancellationToken cancellationToken)
    {
        ReceiptItem? receiptItem = await _receiptItemRepository.GetByIdAsync(
            receiptItemId: request.ReceiptId,
            cancellationToken);

        if (receiptItem is null)
        {
            throw new ReceiptItemNotFound(request.ReceiptId);
        }
        
        Receipt? receipt = await _receiptRepository.GetByIdAsync(
            receiptId: receiptItem.ReceiptId,
            cancellationToken);
        
        if (receipt is null)
        {
            throw new ReceiptNotFound(receiptItem.ReceiptId);
        }
        
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != receipt.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to view the receipt Item.");
        }

        return receiptItem.MapToResponse();
    }
}
