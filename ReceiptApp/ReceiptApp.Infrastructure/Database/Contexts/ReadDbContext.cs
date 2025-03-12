using Microsoft.EntityFrameworkCore;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Models.Stores;
using ReceiptApp.Infrastructure.Database.Configurations.Write;

namespace ReceiptApp.Infrastructure.Database.Contexts;

public sealed class ReadDbContext : DbContext
{
    private DbSet<Receipt> ReceiptsDbSet { get; set; } = null!;
    private DbSet<ReceiptItem> ReceiptItemsDbSet { get; set; } = null!;
    private DbSet<Store> StoresDbSet { get; set; } = null!;

    public IQueryable<Receipt> Receipts => ReceiptsDbSet.AsNoTracking();
    public IQueryable<ReceiptItem> ReceiptItems => ReceiptItemsDbSet.AsNoTracking();
    public IQueryable<Store> Stores => StoresDbSet.AsNoTracking();

    public ReadDbContext(DbContextOptions<ReadDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            AssemblyReference.Assembly,
            t => t.GetInterfaces().Any(i =>
                i.IsGenericType &&
                i.GetGenericTypeDefinition() == typeof(IWriteEntityConfiguration<>)
            )
        );
    }

    public override int SaveChanges()
    {
        throw new InvalidOperationException("ReadDbContext does not support SaveChanges.");
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        throw new InvalidOperationException("ReadDbContext does not support SaveChangesAsync.");
    }
}
