using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Models.Receipts;

namespace ReceiptApp.Infrastructure.Database.Configurations.Write;

internal sealed class ReceiptConfiguration : IWriteEntityConfiguration<Receipt>
{
       public void Configure(EntityTypeBuilder<Receipt> builder)
       {
              builder.ToTable("Receipts");
              
              builder.HasKey(r => r.ReceiptId);

              builder.HasOne(r => r.User)
                     .WithMany() 
                     .HasForeignKey(r => r.UserId)
                     .OnDelete(DeleteBehavior.Cascade); 
              
              builder.HasOne(r => r.Store)
                     .WithMany(s => s.Receipts)
                     .IsRequired(false)
                     .HasForeignKey(r => r.StoreId)
                     .OnDelete(DeleteBehavior.SetNull);
              
              builder.HasMany(r => r.ReceiptItems)
                     .WithOne(ri => ri.Receipt)
                     .HasForeignKey(ri => ri.ReceiptId)
                     .OnDelete(DeleteBehavior.Cascade);
              
              builder.Property(r => r.TotalPLN)
                     .HasColumnType("numeric(18,2)") 
                     .IsRequired();

              builder.Property(r => r.TotalTax)
                     .HasColumnType("numeric(18,2)") 
                     .IsRequired();

              builder.Property(r => r.PaymentType)
                     .HasMaxLength(PaymentTypeTooLongException.MAX_LENGTH)
                     .IsRequired();

              builder.Property(r => r.Comment)
                     .HasMaxLength(CommentTooLongException.MAX_LENGTH);

              builder.Property(r => r.IssuedAt)
                     .IsRequired();

              builder.Property(r => r.CreatedOnUtc)
                     .IsRequired();

              builder.Property(r => r.ModifiedOnUtc)
                     .IsRequired(false);
       }
}