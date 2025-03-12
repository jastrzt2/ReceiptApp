using Microsoft.EntityFrameworkCore;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Infrastructure.Database.Contexts;
using Shared.Contracts.Receipts.Requests;
using Shared.Contracts.Shared;

namespace ReceiptApp.Infrastructure.Database.Repositories.Read;

public class ReceiptReadRepository : IReceiptReadRepository
{
    private readonly ReadDbContext _context;

    public ReceiptReadRepository(ReadDbContext context)
    {
        _context = context;
    }

    public async Task<Receipt?> GetByIdAsync(Guid receiptId, CancellationToken cancellationToken)
    {
        return await _context.Receipts
            .FirstOrDefaultAsync(r => r.ReceiptId.Equals(receiptId), cancellationToken);
    }

    public async Task<PagedItems<Receipt>> GetUserReceiptByFilterAsync(ReceiptFilter filter,
        String userId,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        IQueryable<Receipt> query = _context.Receipts;
        
        query = query.Where(r => r.UserId == userId);
        
        if (filter.StoreId.HasValue)
        {
            query = query.Where(r => r.StoreId.Equals(filter.StoreId.Value));
        }

        if (filter.MinTotalPLN.HasValue)
        {
            query = query.Where(r => r.TotalPLN >= filter.MinTotalPLN.Value);
        }

        if (filter.MaxTotalPLN.HasValue)
        {
            query = query.Where(r => r.TotalPLN <= filter.MaxTotalPLN.Value);
        }

        if (filter.MinTotalTax.HasValue)
        {
            query = query.Where(r => r.TotalTax >= filter.MinTotalTax.Value);
        }

        if (filter.MaxTotalTax.HasValue)
        {
            query = query.Where(r => r.TotalTax <= filter.MaxTotalTax.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.PaymentType))
        {
            query = query.Where(r => r.PaymentType.ToLower().Contains(filter.PaymentType.ToLower()));
        }
        
        if (filter.StartIssuedAt.HasValue)
        {
            query = query.Where(r => r.IssuedAt >= filter.StartIssuedAt.Value);
        }

        if (filter.EndIssuedAt.HasValue)
        {
            query = query.Where(r => r.IssuedAt <= filter.EndIssuedAt.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Comment))
        {
            query = query.Where(r => r.Comment.ToLower().Contains(filter.Comment.ToLower()));
        }


        int totalCount = await query.CountAsync(cancellationToken);
        
        
        
        List<Receipt> receipts = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedItems<Receipt>
        {
            Items = receipts,
            TotalCount = totalCount,
            PageSize = pageSize,
            CurrentPage = pageNumber
        };
    }
    
    public async Task<Dictionary<int, decimal>> GetAnnualStatisticsAsync(string userId, int year, CancellationToken cancellationToken)
    {
        return await _context.Receipts
            .Where(r => r.IssuedAt.Year == year)
            .Where(r=>r.UserId == userId)
            .GroupBy(r => r.IssuedAt.Month)
            .ToDictionaryAsync(g => g.Key, g => g.Sum(r => r.TotalPLN), cancellationToken);
    }
    
    public async Task<Dictionary<int, decimal>> GetMonthlyDailyStatisticsAsync(string userId,int year, int month, CancellationToken cancellationToken)
    {
        return await _context.Receipts
            .Where(r => r.IssuedAt.Year == year)
            .Where(r => r.IssuedAt.Month == month)
            .Where(r=>r.UserId == userId)
            .GroupBy(r => r.IssuedAt.Day)
            .ToDictionaryAsync(g => g.Key, g => g.Sum(r => r.TotalPLN), cancellationToken);
    }
    
    
}