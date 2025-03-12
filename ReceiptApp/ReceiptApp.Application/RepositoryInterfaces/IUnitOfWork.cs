namespace ReceiptApp.Application.RepositoryInterfaces;

public interface IUnitOfWork
{
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}