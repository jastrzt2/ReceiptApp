using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReceiptApp.Domain.Exceptions.StoreExceptions;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Models.Stores;

namespace ReceiptApp.Infrastructure.Database.Configurations.Write
{
    internal sealed class StoreConfiguration : IWriteEntityConfiguration<Store>
    {
        public void Configure(EntityTypeBuilder<Store> builder)
        {
            builder.ToTable("Stores");
            
            builder.HasKey(s => s.StoreId);
            
            builder.HasOne(s => s.User)
                .WithMany() 
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade); 
            
            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(StoreNameTooLongException.MAX_LENGTH);

            builder.Property(s => s.Address)
                .IsRequired()
                .HasMaxLength(StoreAddressTooLongException.MAX_LENGTH);
            
            builder.Property(s => s.CreatedOnUtc)
                .IsRequired();

            builder.Property(s => s.ModifiedOnUtc)
                .IsRequired(false);
        }
    }
}