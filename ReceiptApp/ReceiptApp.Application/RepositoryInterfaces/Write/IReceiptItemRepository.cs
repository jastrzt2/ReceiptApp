using ReceiptApp.Domain.Models.ReceiptItems;

namespace ReceiptApp.Application.RepositoryInterfaces.Write;

public interface IReceiptItemRepository
{
    Task<ReceiptItem?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);
  
    void Add(ReceiptItem receiptItem);

    void Update(ReceiptItem receiptItem);

    void Remove(ReceiptItem receiptItem);
}
