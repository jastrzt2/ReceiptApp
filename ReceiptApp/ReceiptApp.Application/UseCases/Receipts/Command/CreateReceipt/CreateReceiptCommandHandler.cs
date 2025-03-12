using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Exceptions.StoreExceptions;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;

namespace ReceiptApp.Application.UseCases.Receipts.Command.CreateReceipt;

internal sealed class CreateReceiptCommandHandler : ICommandHandler<CreateReceiptCommand, Guid>
{
    private readonly IReceiptRepository _receiptRepository;
    private readonly IStoreRepository _storeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateReceiptCommandHandler(
        IReceiptRepository receiptRepository,
        IStoreRepository storeRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _receiptRepository = receiptRepository;
        _storeRepository = storeRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(CreateReceiptCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier).Value;

        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated or invalid userId.");
        }
        
        if (request.StoreId.HasValue && request.StoreId != Guid.Empty)
        {
            Domain.Models.Stores.Store store = await _storeRepository.GetByIdAsync(request.StoreId.Value, cancellationToken);
            if (store == null)
            {
                throw new StoreNotFound(request.StoreId.Value);
            }
        }

        var receipt = Receipt.Create(
            receiptId: Guid.NewGuid(),
            receiptItems: new List<ReceiptItem>(),
            userId: userId,
            user: null,
            storeId: request.StoreId,
            store: null,
            totalPLN: request.TotalPLN,
            totalTax: request.TotalTax,
            paymentType: request.PaymentType,
            change: request.Change,
            comment: request.Comment ?? string.Empty, 
            issuedAt: request.IssuedAt
        );  

        _receiptRepository.Add(receipt);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return receipt.ReceiptId;
    }
}