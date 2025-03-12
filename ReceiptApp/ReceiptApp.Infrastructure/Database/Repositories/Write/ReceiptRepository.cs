using Microsoft.EntityFrameworkCore;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Infrastructure.Database.Contexts;

namespace ReceiptApp.Infrastructure.Database.Repositories.Write;

public class ReceiptRepository : IReceiptRepository
{
    private readonly WriteDbContext _writeContext;

    public ReceiptRepository(WriteDbContext writeContext)
    {
        _writeContext = writeContext;
    }

    public async Task<Receipt?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _writeContext.Receipts
            .FirstOrDefaultAsync(r => r.ReceiptId == id, cancellationToken);
    }
    
    public async Task<Receipt?> GetFirstByStoreId(Guid storeId, CancellationToken cancellationToken)
    {
        return await _writeContext.Receipts
            .FirstOrDefaultAsync(r => r.StoreId == storeId, cancellationToken);
    }

    public void Add(Receipt receipt)
    {
        _writeContext.Receipts.Add(receipt);
    }

    public void Update(Receipt receipt)
    {
        _writeContext.Receipts.Update(receipt);
    }

    public void Remove(Receipt receipt)
    {
        _writeContext.Receipts.Remove(receipt);
    }
}