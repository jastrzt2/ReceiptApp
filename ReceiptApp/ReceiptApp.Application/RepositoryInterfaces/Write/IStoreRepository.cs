using ReceiptApp.Domain.Models.Stores;

namespace ReceiptApp.Application.RepositoryInterfaces.Write;

public interface IStoreRepository
{
    Task<Store?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);
  
    void Add(Store store);

    void Update(Store store);

    void Remove(Store store);
}
