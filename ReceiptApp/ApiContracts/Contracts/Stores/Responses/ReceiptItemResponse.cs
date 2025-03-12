namespace Shared.Contracts.Stores.Responses;

public record StoreResponse(
    Guid StoreId,
    string UserId,
    string Name,
    string Address,
    DateTime CreatedOnUtc,
    DateTime? ModifiedOnUtc
);
