using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Models.Receipts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using ReceiptApp.Domain.Models.Users;

namespace ReceiptApp.Application.UseCases.Receipts.Command.UpdateReceipt;

internal sealed class UpdateReceiptCommandHandler : ICommandHandler<UpdateReceiptCommand, Guid>
{
    private readonly IReceiptRepository _receiptRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateReceiptCommandHandler(
        IReceiptRepository receiptRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _receiptRepository = receiptRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(UpdateReceiptCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        Receipt receipt = await _receiptRepository.GetByIdAsync(request.ReceiptId, cancellationToken);
        if (receipt == null)
        {
            throw new ReceiptNotFound(request.ReceiptId);
        }

        if (userId != receipt.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to update the receipt.");
        }

        receipt.Update(
            userId: userId,
            storeId: request.StoreId,
            totalPLN: request.TotalPLN,
            totalTax: request.TotalTax,
            paymentType: request.PaymentType,
            change: request.Change,
            comment: request.Comment,
            issuedAt: request.IssuedAt
        );

        _receiptRepository.Update(receipt);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return receipt.ReceiptId;
    }
}
