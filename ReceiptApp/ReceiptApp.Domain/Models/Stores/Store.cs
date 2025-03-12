using ReceiptApp.Domain.Exceptions.StoreExceptions;
using ReceiptApp.Domain.Models.Receipts;
using ReceiptApp.Domain.Models.Users;

namespace ReceiptApp.Domain.Models.Stores;


public class Store
{
    public Guid StoreId { get; private set; }
    public string UserId { get; private set; }
    public User User { get; private set; }
    public string Name { get; private set; }
    public string Address { get; private set; }
    private List<Receipt> _receipts = new List<Receipt>();
    public IReadOnlyList<Receipt> Receipts => _receipts.AsReadOnly();
    public DateTime CreatedOnUtc { get; }
    public DateTime? ModifiedOnUtc { get; }

    private Store() 
    {
        CreatedOnUtc = DateTime.UtcNow;
    }

    private Store(Guid storeId, string userId, User user, string name, string address) : this()
    {
        StoreId = storeId;
        UserId = userId;
        User = user;
        Name = name;
        Address = address;
    }

    public static Store Create(Guid storeId, string userId, User user, string name, string address)
    {
        if (storeId == Guid.Empty)
        {
            throw new StoreIdEmptyException();
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new StoreUserIdEmptyException();
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new StoreNameEmptyException();
        }

        if (name.Length > StoreNameTooLongException.MAX_LENGTH)
        {
            throw new StoreNameTooLongException();
        }

        if (string.IsNullOrWhiteSpace(address))
        {
            throw new StoreAddressEmptyException();
        }

        if (address.Length > StoreAddressTooLongException.MAX_LENGTH)
        {
            throw new StoreAddressTooLongException();
        }

        return new Store(storeId, userId, user, name, address); // Przekazywanie User
    }

    public void Update(
        string? userId = null,
        User user = null,
        string? name = null,
        string? address = null)
    {
        if (userId is not null)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new StoreUserIdEmptyException();
            }

            UserId = userId;
        }

        if (user is not null)
        {
            User = user;
        }

        if (name is not null)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new StoreNameEmptyException();
            }

            if (name.Length > StoreNameTooLongException.MAX_LENGTH)
            {
                throw new StoreNameTooLongException();
            }

            Name = name;
        }

        if (address is null) return;
        if (string.IsNullOrWhiteSpace(address))
        {
            throw new StoreAddressEmptyException();
        }

        if (address.Length > StoreAddressTooLongException.MAX_LENGTH)
        {
            throw new StoreAddressTooLongException();
        }

        Address = address;
    }
}
