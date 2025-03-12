using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.Mappers;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Models.Receipts;
using Shared.Contracts.Receipts.Responses;

namespace ReceiptApp.Application.UseCases.Receipts.Query.GetReceiptById;

internal sealed class GetReceiptByIdQueryHandler
    : IQueryHandler<GetReceiptByIdQuery, ReceiptResponse>
{
    private readonly IReceiptReadRepository _receiptRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetReceiptByIdQueryHandler(IReceiptReadRepository receiptRepository, IHttpContextAccessor httpContextAccessor)
    {
        _receiptRepository = receiptRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ReceiptResponse> Handle(
        GetReceiptByIdQuery request,
        CancellationToken cancellationToken)
    {
        Receipt? receipt = await _receiptRepository.GetByIdAsync(
            receiptId: request.ReceiptId,
            cancellationToken);
        
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != receipt.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to view the receipt.");
        }
        
        if (receipt is null)
        {
            throw new ReceiptNotFound(request.ReceiptId);
        }

        return receipt.MapToResponse();
    }
}
