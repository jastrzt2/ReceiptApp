using Shared.Contracts.Shared;

namespace Shared.Contracts.Stores.Requests;

public record StoreFilter : AuditableFilter
{
    public Guid? StoreId { get; set; }
    public string? Name { get; set; }
    public string? Address { get; set; }
}
