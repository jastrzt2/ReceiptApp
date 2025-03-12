using Microsoft.EntityFrameworkCore;

namespace ReceiptApp.Infrastructure.Database.Configurations.Write;

public interface IWriteEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : class
{
}
