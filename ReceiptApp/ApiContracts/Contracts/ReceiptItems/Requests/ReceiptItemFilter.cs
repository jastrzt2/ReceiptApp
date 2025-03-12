using ReceiptApp.Domain.Enums;
using Shared.Contracts.Shared;

namespace Shared.Contracts.ReceiptItems.Requests;

public record ReceiptItemFilter : AuditableFilter
{
    public Guid? ReceiptId { get; set; }
    public string? ProductName { get; set; }
    public int? MinQuantity { get; set; }
    public int? MaxQuantity { get; set; }
    public decimal? MinProductPrice { get; set; }
    public decimal? MaxProductPrice { get; set; }
    public TaxationType? TaxationType { get; set; }
    public ProductCategory? ProductCategory { get; set; }
}