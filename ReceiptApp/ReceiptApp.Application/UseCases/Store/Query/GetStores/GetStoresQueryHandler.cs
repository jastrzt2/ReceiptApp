using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.Mappers;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using Shared.Contracts.Shared;
using Shared.Contracts.Stores.Responses;

namespace ReceiptApp.Application.UseCases.Store.Query.GetStores;

internal sealed class GetStoresQueryHandler
    : IQueryHandler<GetStoresQuery, PagedItems<StoreResponse>>
{
    private readonly IStoreReadRepository _storeRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetStoresQueryHandler(
        IStoreReadRepository storeRepository, 
        IHttpContextAccessor httpContextAccessor)
    {
        _storeRepository = storeRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PagedItems<StoreResponse>> Handle(
        GetStoresQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            throw new NullReferenceException();
        }
        
        PagedItems<Domain.Models.Stores.Store>? storePage = await _storeRepository.GetStoreByFilterAsync(
            filter: request.Filter,
            userId: userId,
            pageNumber: request.PageNumber,
            pageSize: request.PageSize,
            cancellationToken);
        var responsePage = new PagedItems<StoreResponse>
        {
            Items = storePage.Items.Select(s => s.MapToResponse()).ToList(),
            TotalCount = storePage.TotalCount,
            PageSize = storePage.PageSize,
            CurrentPage = storePage.CurrentPage
        };

        return responsePage;
    }
}
