using Microsoft.EntityFrameworkCore;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Models.Stores;
using ReceiptApp.Infrastructure.Database.Contexts;
using Shared.Contracts.Shared;
using Shared.Contracts.Stores.Requests;

namespace ReceiptApp.Infrastructure.Database.Repositories.Read;

public class StoreReadRepository : IStoreReadRepository
{
    private readonly ReadDbContext _context;

    public StoreReadRepository(ReadDbContext context)
    {
        _context = context;
    }

    public async Task<Store?> GetByIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.Stores
            .FirstOrDefaultAsync(s => s.StoreId.Equals(storeId), cancellationToken);
    }

    public async Task<PagedItems<Store>> GetStoreByFilterAsync(StoreFilter filter, String userId, int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        IQueryable<Store> query = _context.Stores;

        if (filter.StoreId.HasValue)
        {
            query = query.Where(s => s.StoreId == filter.StoreId.Value);
        }

        if (!string.IsNullOrWhiteSpace(userId))
        {
            query = query.Where(s => s.UserId == userId);
        }

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            query = query.Where(s => s.Name.ToLower().Contains(filter.Name.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(filter.Address))
        {
            query = query.Where(s => s.Address.ToLower().Contains(filter.Address.ToLower()));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query.Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedItems<Store>
        {
            Items = items,
            TotalCount = totalCount,
            PageSize = pageSize,
            CurrentPage = pageNumber
        };
    }


}