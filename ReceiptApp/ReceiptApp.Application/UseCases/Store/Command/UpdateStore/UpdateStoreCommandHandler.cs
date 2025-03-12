using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Application.UseCases.Receipts.Command.UpdateReceipt;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;
using ReceiptApp.Domain.Exceptions.StoreExceptions;
using ReceiptApp.Domain.Models.Stores;

namespace ReceiptApp.Application.UseCases.Store.Command.UpdateStore;

internal sealed class UpdateStoreCommandHandler : ICommandHandler<UpdateStoreCommand, Guid>
{
    private readonly IStoreRepository _storeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateStoreCommandHandler(
        IStoreRepository storeRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _storeRepository = storeRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(UpdateStoreCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var store = await _storeRepository.GetByIdAsync(request.StoreId, cancellationToken);
        if (store == null)
        {
            throw new StoreNotFound(request.StoreId);
        }

        if (userId != store.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to update the Store.");
        }

        store.Update(
            userId: userId,
            name: request.Name,
            address: request.Address
        );  
        
        _storeRepository.Update(store);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return store.StoreId;
    }
}
