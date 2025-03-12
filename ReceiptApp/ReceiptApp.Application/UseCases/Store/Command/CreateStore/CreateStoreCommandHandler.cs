using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;

namespace ReceiptApp.Application.UseCases.Store.Command.CreateStore;

internal sealed class CreateStoreCommandHandler : ICommandHandler<CreateStoreCommand, Guid>
{
    private readonly IStoreRepository _storeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateStoreCommandHandler(
        IStoreRepository storeRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor)
    {
        _storeRepository = storeRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(CreateStoreCommand request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated or invalid userId.");
        }

        var store = Domain.Models.Stores.Store.Create(
            storeId: Guid.NewGuid(),
            userId: userId,  
            user: null, 
            name: request.Name,
            address: request.Address
        );  

        _storeRepository.Add(store);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return store.StoreId;
    }
}