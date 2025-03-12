using ReceiptApp.Domain.Models.Receipts;

namespace ReceiptApp.Application.RepositoryInterfaces.Write;

public interface IReceiptRepository
{
    Task<Receipt?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);
    
    Task<Receipt?> GetFirstByStoreId(
        Guid storeId,
        CancellationToken cancellationToken);

  
    void Add(Receipt receipt);

    void Update(Receipt receipt);

    void Remove(Receipt receipt);
}
