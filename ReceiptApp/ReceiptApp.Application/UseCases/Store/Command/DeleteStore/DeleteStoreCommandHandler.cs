using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Application.UseCases.Receipts.Command.DeleteReceipt;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;
using ReceiptApp.Domain.Exceptions.StoreExceptions;

namespace ReceiptApp.Application.UseCases.Store.Command.DeleteStore;

internal sealed class DeleteStoreCommandHandler : ICommandHandler<DeleteStoreCommand, Guid>
{
    private readonly IStoreRepository _storeRepository;
    private readonly IReceiptRepository _receiptRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteStoreCommandHandler(
        IStoreRepository storeRepository,
        IReceiptRepository receiptRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _storeRepository = storeRepository;
        _receiptRepository = receiptRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(DeleteStoreCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        var store = await _storeRepository.GetByIdAsync(request.StoreId, cancellationToken);
        if (store is null)
        {
            throw new StoreNotFound(request.StoreId);
        }

        if (userId != store.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to delete the Store.");
        }
        
        _storeRepository.Remove(store);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return store.StoreId;
    }
}