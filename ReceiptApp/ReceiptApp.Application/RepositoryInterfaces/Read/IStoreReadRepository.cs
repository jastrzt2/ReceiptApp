using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Models.Stores;
using Shared.Contracts.Receipts.Requests;
using Shared.Contracts.Shared;
using Shared.Contracts.Stores.Requests;

namespace ReceiptApp.Application.RepositoryInterfaces.Read
{
    public interface IStoreReadRepository
    {
        Task<Store?> GetByIdAsync(
            Guid storeId, 
            CancellationToken cancellationToken);
        Task<PagedItems<Store>> GetStoreByFilterAsync(
            StoreFilter filter,
            string userId,
            int pageNumber, 
            int pageSize, 
            CancellationToken cancellationToken
            );
    }
}