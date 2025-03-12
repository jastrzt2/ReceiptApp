using Microsoft.EntityFrameworkCore;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Models.Stores;
using ReceiptApp.Infrastructure.Database.Contexts;

namespace ReceiptApp.Infrastructure.Database.Repositories.Write;

public class StoreRepository : IStoreRepository
{
    private readonly WriteDbContext _writeContext;

    public StoreRepository(WriteDbContext writeContext)
    {
        _writeContext = writeContext;
    }

    public async Task<Store?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _writeContext.Stores
            .FirstOrDefaultAsync(s => s.StoreId == id, cancellationToken);
    }

    public void Add(Store store)
    {
        _writeContext.Stores.Add(store);
    }

    public void Update(Store store)
    {
        _writeContext.Stores.Update(store);
    }

    public void Remove(Store store)
    {
        _writeContext.Stores.Remove(store);
    }
}