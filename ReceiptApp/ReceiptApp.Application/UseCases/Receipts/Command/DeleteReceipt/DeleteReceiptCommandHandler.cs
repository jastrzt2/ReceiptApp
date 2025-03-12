using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ReceiptApp.Application.UseCases.Receipts.Command.DeleteReceipt;

internal sealed class DeleteReceiptCommandHandler : ICommandHandler<DeleteReceiptCommand, Guid>
{
    private readonly IReceiptRepository _receiptRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteReceiptCommandHandler(
        IReceiptRepository receiptRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _receiptRepository = receiptRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(DeleteReceiptCommand request, CancellationToken cancellationToken)
    {
        var receipt = await _receiptRepository.GetByIdAsync(request.ReceiptId, cancellationToken);
        if (receipt is null)
        {
            throw new ReceiptNotFound(request.ReceiptId);
        }

        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != receipt.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to delete the receipt.");
        }

        _receiptRepository.Remove(receipt);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return receipt.ReceiptId;
    }
}