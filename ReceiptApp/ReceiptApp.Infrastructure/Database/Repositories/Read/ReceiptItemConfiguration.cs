using Microsoft.EntityFrameworkCore;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Infrastructure.Database.Contexts;
using Shared.Contracts.ReceiptItems.Requests;
using Shared.Contracts.Shared;

namespace ReceiptApp.Infrastructure.Database.Repositories.Read;

public class ReceiptItemReadRepository : IReceiptItemReadRepository
{
    private readonly ReadDbContext _context;

    public ReceiptItemReadRepository(ReadDbContext context)
    {
        _context = context;
    }

    public async Task<ReceiptItem?> GetByIdAsync(Guid receiptItemId, CancellationToken cancellationToken)
    {
        return await _context.ReceiptItems
            .FirstOrDefaultAsync(ri => ri.ReceiptItemId.Equals(receiptItemId), cancellationToken);
    }

    public async Task<PagedItems<ReceiptItem>> GetReceiptItemByFilterAsync(
    ReceiptItemFilter filter,
    string userId,
    int pageNumber,
    int pageSize,
    CancellationToken cancellationToken)
    {
        var query = _context.ReceiptItems;

        if (filter.ReceiptId.HasValue)
        {
            query = query.Where(ri => ri.ReceiptId == filter.ReceiptId.Value);
        }
        
        if (!string.IsNullOrWhiteSpace(filter.ProductName))
        {
            query = query.Where(ri => ri.ProductName.ToLower().Contains(filter.ProductName.ToLower()));
        }

        if (filter.MinQuantity.HasValue)
        {
            query = query.Where(ri => ri.Quantity >= filter.MinQuantity.Value);
        }

        if (filter.MaxQuantity.HasValue)
        {
            query = query.Where(ri => ri.Quantity <= filter.MaxQuantity.Value);
        }

        if (filter.MinProductPrice.HasValue)
        {
            query = query.Where(ri => ri.ProductPrice >= filter.MinProductPrice.Value);
        }

        if (filter.MaxProductPrice.HasValue)
        {
            query = query.Where(ri => ri.ProductPrice <= filter.MaxProductPrice.Value);
        }

        if (filter.TaxationType.HasValue)
        {
            query = query.Where(ri => ri.TaxationType == filter.TaxationType.Value);
        }

        if (filter.ProductCategory.HasValue)
        {
            query = query.Where(ri => ri.ProductCategory == filter.ProductCategory.Value);
        }

        query = query.Where(ri => ri.Receipt.UserId == userId);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedItems<ReceiptItem>
        {
            Items = items,
            TotalCount = totalCount,
            PageSize = pageSize,
            CurrentPage = pageNumber
        };
    }

    public async Task<Dictionary<int, decimal>> GetMonthlyCategoryStatisticsAsync(string userId, int year, int month, CancellationToken cancellationToken)
    {
        return await (from receipt in _context.Receipts
                join receiptItem in _context.ReceiptItems on receipt.ReceiptId equals receiptItem.ReceiptId
                where receipt.IssuedAt.Year == year && receipt.IssuedAt.Month == month && receipt.UserId == userId
                group receiptItem by receiptItem.ProductCategory into g
                select new
                {
                    ProductCategory = g.Key,
                    TotalAmount = g.Sum(ri => ri.ProductPrice)
                })
            .ToDictionaryAsync(x => (int)x.ProductCategory, x => x.TotalAmount, cancellationToken);
    }

    
}