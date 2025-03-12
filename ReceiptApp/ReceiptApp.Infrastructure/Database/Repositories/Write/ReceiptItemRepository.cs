using Microsoft.EntityFrameworkCore;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Infrastructure.Database.Contexts;

namespace ReceiptApp.Infrastructure.Database.Repositories.Write;

public class ReceiptItemRepository : IReceiptItemRepository
{
    private readonly WriteDbContext _writeContext;

    public ReceiptItemRepository(WriteDbContext writeContext)
    {
        _writeContext = writeContext;
    }

    public async Task<ReceiptItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _writeContext.ReceiptItems
            .FirstOrDefaultAsync(ri => ri.ReceiptItemId == id, cancellationToken);
    }

    public void Add(ReceiptItem receiptItem)
    {
        _writeContext.ReceiptItems.Add(receiptItem);
    }

    public void Update(ReceiptItem receiptItem)
    {
        _writeContext.ReceiptItems.Update(receiptItem);
    }

    public void Remove(ReceiptItem receiptItem)
    {
        _writeContext.ReceiptItems.Remove(receiptItem);
    }
}