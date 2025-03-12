using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Models.Stores;
using ReceiptApp.Domain.Models.Users;
using ReceiptApp.Infrastructure.Database.Configurations.Write;

namespace ReceiptApp.Infrastructure.Database.Contexts;

public sealed class WriteDbContext : IdentityDbContext<User>
{
    internal DbSet<Receipt> Receipts { get; set; }
    internal DbSet<ReceiptItem> ReceiptItems { get; set; }
    internal DbSet<Store> Stores { get; set; }
    
    public WriteDbContext(DbContextOptions<WriteDbContext> options)
        : base(options)
    {
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        ApplyConfigurations(modelBuilder);
    }

    private void ApplyConfigurations(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            AssemblyReference.Assembly,
            t => t.GetInterfaces().Any(i =>
                i.IsGenericType &&
                i.GetGenericTypeDefinition() == typeof(IWriteEntityConfiguration<>)));
    }
}
