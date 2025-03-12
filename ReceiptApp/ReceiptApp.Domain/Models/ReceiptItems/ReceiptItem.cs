using ReceiptApp.Domain.Enums;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Exceptions.ReceiptItemExceptions;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Primitives;

namespace ReceiptApp.Domain.Models.ReceiptItems;

public class ReceiptItem: IAuditableEntity
{
    public Guid ReceiptItemId { get; private set; }
    
    public Guid ReceiptId { get; private set; }
    public Receipt Receipt { get; private set; }
    public string ProductName { get; private set; }
    public int Quantity { get; private set; }
    public decimal ProductPrice { get; private set; }
    public TaxationType TaxationType { get; private set; }
    public ProductCategory ProductCategory { get; private set; }
    public DateTime CreatedOnUtc { get; }
    public DateTime? ModifiedOnUtc { get; }

    private ReceiptItem() { }

    private ReceiptItem(
        Guid receiptItemId,
        Guid receiptId,
        Receipt receipt,
        string productName,
        int quantity,
        decimal productPrice,
        TaxationType taxationType,
        ProductCategory productCategory)
    {
        ReceiptItemId = receiptItemId;
        ReceiptId = receiptId;
        Receipt = receipt;
        ProductName = productName;
        Quantity = quantity;
        ProductPrice = productPrice;
        TaxationType = taxationType;
        ProductCategory = productCategory;
    }

    public static ReceiptItem Create(
        Guid receiptItemId,
        Guid receiptId,
        Receipt receipt,
        string productName,
        int quantity,
        decimal productPrice,
        TaxationType taxationType,
        ProductCategory productCategory)
    {
        if (receiptItemId == Guid.Empty)
        {
            throw new ReceiptItemIdEmptyException();
        }

        if (receiptId == Guid.Empty)
        {
            throw new ReceiptIdEmptyException();
        }

        if (string.IsNullOrWhiteSpace(productName))
        {
            throw new ProductNameEmptyException();
        }

        if (productName.Length > ProductNameTooLongException.MAX_LENGTH)
        {
            throw new ProductNameTooLongException();
        }

        if (quantity <= 0)
        {
            throw new QuantityInvalidException();
        }

        if (productPrice < 0)
        {
            throw new ProductPriceInvalidException();
        }

        return new ReceiptItem(
            receiptItemId,
            receiptId,
            receipt,
            productName,
            quantity,
            productPrice,
            taxationType,
            productCategory);
    }
    
    public void Update(
        Guid? receiptId = null,
        Receipt receipt = null,
        string? productName = null,
        int? quantity = null,
        decimal? productPrice = null,
        TaxationType? taxationType = null,
        ProductCategory? productCategory = null)
    {
        if (receiptId.HasValue)
        {
            if (receiptId.Value == Guid.Empty)
            {
                throw new ReceiptIdEmptyException();
            }
            ReceiptId = receiptId.Value;
        }

        if (receipt is not null)
        {
            Receipt = receipt;
        }

        if (productName is not null)
        {
            if (string.IsNullOrWhiteSpace(productName))
            {
                throw new ProductNameEmptyException();
            }

            if (productName.Length > ProductNameTooLongException.MAX_LENGTH)
            {
                throw new ProductNameTooLongException();
            }

            ProductName = productName;
        }

        if (quantity.HasValue)
        {
            if (quantity.Value <= 0)
            {
                throw new QuantityInvalidException();
            }
            Quantity = quantity.Value;
        }

        if (productPrice.HasValue)
        {
            if (productPrice.Value < 0)
            {
                throw new ProductPriceInvalidException();
            }
            ProductPrice = productPrice.Value;
        }

        if (taxationType.HasValue)
        {
            TaxationType = taxationType.Value;
        }

        if (productCategory.HasValue)
        {
            ProductCategory = productCategory.Value;
        }
    }
}
