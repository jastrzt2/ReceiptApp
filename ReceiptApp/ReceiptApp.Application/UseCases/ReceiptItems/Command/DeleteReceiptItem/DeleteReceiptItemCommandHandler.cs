using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Command.DeleteReceiptItem;

internal sealed class DeleteReceiptItemCommandHandler : ICommandHandler<DeleteReceiptItemCommand, Guid>
{
    private readonly IReceiptItemRepository _receiptItemRepository;
    private readonly IReceiptRepository _receiptRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteReceiptItemCommandHandler(
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

    public async Task<Guid> Handle(DeleteReceiptItemCommand request, CancellationToken cancellationToken)
    {
        var receiptItem = await _receiptItemRepository.GetByIdAsync(request.ReceiptItemId, cancellationToken);
        if (receiptItem is null)
        {
            throw new ReceiptItemNotFound(request.ReceiptItemId);
        }

        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var receipt = await _receiptRepository.GetByIdAsync(receiptItem.ReceiptId, cancellationToken);
        if (receipt == null)
        {
            throw new ReceiptNotFound(receiptItem.ReceiptId);
        }

        if (userId != receipt.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to delete the receipt item.");
        }

        _receiptItemRepository.Remove(receiptItem);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return receiptItem.ReceiptId;
    }
}
