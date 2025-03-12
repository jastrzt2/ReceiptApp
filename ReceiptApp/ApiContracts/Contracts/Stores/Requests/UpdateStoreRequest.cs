namespace Shared.Contracts.Stores.Requests;

public record UpdateStoreRequest(
    string Name,
    string Address
);