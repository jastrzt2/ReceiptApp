using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;
using Shared.Contracts.ReceiptItems.Requests;
using Shared.Contracts.Receipts.Requests;
using Shared.Contracts.Shared;

namespace ReceiptApp.Application.RepositoryInterfaces.Read
{
    public interface IReceiptItemReadRepository
    {
        Task<ReceiptItem?> GetByIdAsync(
            Guid receiptItemId, 
            CancellationToken cancellationToken);
        Task<PagedItems<ReceiptItem>> GetReceiptItemByFilterAsync(
            ReceiptItemFilter filter, 
            String userId, 
            int pageNumber, 
            int pageSize, 
            CancellationToken cancellationToken
            );
        
        Task<Dictionary<int, decimal>> GetMonthlyCategoryStatisticsAsync(string userId, int Year, int Month,
            CancellationToken cancellationToken);
    }
}