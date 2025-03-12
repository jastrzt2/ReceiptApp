using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Command.UpdateReceiptItem;

internal sealed class UpdateReceiptItemCommandHandler : ICommandHandler<UpdateReceiptItemCommand, Guid>
{
    private readonly IReceiptItemRepository _receiptItemRepository;
    private readonly IReceiptRepository _receiptRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateReceiptItemCommandHandler(
        IReceiptItemRepository receiptItemRepository,
        IReceiptRepository receiptRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _receiptItemRepository = receiptItemRepository;
        _receiptRepository = receiptRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(UpdateReceiptItemCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        ReceiptItem receiptItem = await _receiptItemRepository.GetByIdAsync(request.ReceiptItemId, cancellationToken);
        if (receiptItem == null)
        {
            throw new ReceiptItemNotFound(request.ReceiptItemId);
        }
        Receipt receipt = await _receiptRepository.GetByIdAsync(receiptItem.ReceiptId, cancellationToken);
        if (receipt == null)
        {
            throw new ReceiptNotFound(request.ReceiptItemId);
        }

        if (userId != receipt.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to update the receiptItem.");
        }

        receiptItem.Update(
            productName: request.ProductName,
            quantity: request.Quantity,
            productPrice: request.ProductPrice,
            taxationType: request.TaxationType,
            productCategory: request.ProductCategory
        );

        _receiptItemRepository.Update(receiptItem);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return receiptItem.ReceiptId;
    }
}
