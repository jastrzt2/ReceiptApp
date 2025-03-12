using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.Mappers;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using Shared.Contracts.Stores.Responses;

namespace ReceiptApp.Application.UseCases.Store.Query.GetStoreById;

internal sealed class GetStoreByIdQueryHandler
    : IQueryHandler<GetStoreByIdQuery, StoreResponse>
{
    private readonly IStoreReadRepository _storeRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetStoreByIdQueryHandler(IStoreReadRepository storeRepository, IHttpContextAccessor httpContextAccessor)
    {
        _storeRepository = storeRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<StoreResponse> Handle(
        GetStoreByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Models.Stores.Store? store = await _storeRepository.GetByIdAsync(
            storeId: request.StoreId,
            cancellationToken);
        
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != store.UserId.ToString())
        {
            throw new UnauthorizedAccessException("This User is not authorized to view the store.");
        }
        

        return store.MapToResponse();
    }
}
