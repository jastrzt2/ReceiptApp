using Microsoft.EntityFrameworkCore;

namespace ReceiptApp.Infrastructure.Database.Configurations.Read;

public interface IReadEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : class
{
}
