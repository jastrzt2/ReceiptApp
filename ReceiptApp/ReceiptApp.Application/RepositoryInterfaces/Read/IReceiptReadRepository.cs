using ReceiptApp.Domain.Models.Receipts;
using Shared.Contracts.Receipts.Requests;
using Shared.Contracts.Shared;

namespace ReceiptApp.Application.RepositoryInterfaces.Read
{
    public interface IReceiptReadRepository
    {
        Task<Receipt?> GetByIdAsync(
            Guid receiptId, 
            CancellationToken cancellationToken);
        Task<PagedItems<Receipt>> GetUserReceiptByFilterAsync(
            ReceiptFilter filter, 
            String userId, 
            int pageNumber, 
            int pageSize, 
            CancellationToken cancellationToken
            );
        
        Task<Dictionary<int, decimal>> GetAnnualStatisticsAsync(string userId, int Year,
            CancellationToken cancellationToken);
        
        Task<Dictionary<int, decimal>> GetMonthlyDailyStatisticsAsync(string userId, int Year, int Month,
            CancellationToken cancellationToken);
        
    }
}