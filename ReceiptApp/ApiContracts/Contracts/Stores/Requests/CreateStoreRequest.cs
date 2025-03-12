namespace Shared.Contracts.Stores.Requests;

public record CreateStoreRequest(
    string Name,
    string Address
);