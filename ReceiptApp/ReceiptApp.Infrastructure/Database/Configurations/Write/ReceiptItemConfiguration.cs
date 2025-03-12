using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;

namespace ReceiptApp.Infrastructure.Database.Configurations.Write
{
    internal sealed class ReceiptItemsConfigurations : IWriteEntityConfiguration<ReceiptItem>
    {
        public void Configure(EntityTypeBuilder<ReceiptItem> builder)
        {
            builder.ToTable("ReceiptItems");
            
            builder.HasKey(ri => ri.ReceiptItemId);

            builder.Property(ri => ri.ProductName)
                .IsRequired()
                .HasMaxLength(ProductNameTooLongException.MAX_LENGTH);

            builder.Property(ri => ri.Quantity)
                .IsRequired();

            builder.Property(ri => ri.ProductPrice)
                .IsRequired();

            builder.Property(ri => ri.TaxationType)
                .IsRequired();

            builder.Property(ri => ri.ProductCategory)
                .IsRequired();
            
            builder.Property(ri => ri.CreatedOnUtc)
                .IsRequired();

            builder.Property(ri => ri.ModifiedOnUtc)
                .IsRequired(false);
        }
    }
}