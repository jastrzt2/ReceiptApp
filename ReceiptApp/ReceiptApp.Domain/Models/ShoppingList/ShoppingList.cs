using ReceiptApp.Domain.Enums;

namespace ReceiptApp.Domain.Models.ShoppingList;

public class ShoppingList
{
    public Guid ShoppingListId { get; private set; }
    public string UserId { get; private set; }
    public string ListName { get; private set; }
    public string Comment { get; private set; }
    public ShoppingListStatus Status { get; private set; } // Enum representing the status
    public decimal? PredictedCost { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ModifiedAt { get; private set; }
    public DateTime? RealizedAt { get; private set; }

}