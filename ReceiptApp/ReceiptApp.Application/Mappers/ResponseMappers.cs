using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Models.Stores;
using Shared.Contracts.ReceiptItems.Responses;
using Shared.Contracts.Receipts.Responses;
using Shared.Contracts.Stores.Responses;

namespace ReceiptApp.Application.Mappers;

internal static class ResponseMappers
{
    public static ReceiptResponse MapToResponse(this Receipt receipt)
    {
        return new ReceiptResponse(
            ReceiptId: receipt.ReceiptId,
            UserId: receipt.UserId,
            StoreId: receipt.StoreId,
            TotalPLN: receipt.TotalPLN,
            TotalTax: receipt.TotalTax,
            PaymentType: receipt.PaymentType,
            Change: receipt.Change ?? 0,
            Comment: receipt.Comment,
            IssuedAt: receipt.IssuedAt,
            CreatedAt: receipt.CreatedOnUtc,
            ModifiedAt: receipt.ModifiedOnUtc
        );
    }
    
    public static ReceiptItemResponse MapToResponse(this ReceiptItem receiptItem)
    {
        return new ReceiptItemResponse(
            ReceiptItemId: receiptItem.ReceiptItemId,
            ReceiptId: receiptItem.ReceiptId,
            ProductName: receiptItem.ProductName,
            Quantity: receiptItem.Quantity,
            ProductPrice: receiptItem.ProductPrice,
            TaxationType: receiptItem.TaxationType,
            ProductCategory: receiptItem.ProductCategory,
            CreatedOnUtc: receiptItem.CreatedOnUtc,
            ModifiedOnUtc: receiptItem.ModifiedOnUtc
        );
    }
    
    public static StoreResponse MapToResponse(this Store store)
    {
        return new StoreResponse(
            StoreId: store.StoreId,
            UserId: store.UserId,
            Name: store.Name,
            Address: store.Address,
            CreatedOnUtc: store.CreatedOnUtc,
            ModifiedOnUtc: store.ModifiedOnUtc
        );
    }

}