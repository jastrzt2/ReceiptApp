namespace ReceiptApp.Domain.Models.ShoppingListItems;

public class ShoppingListItem
{
    public Guid ShoppingListItemId { get; private set; }
    public Guid ShoppingListId { get; private set; }
    public string ProductName { get; private set; }
    public int Quantity { get; private set; }
    public decimal? PreferablePrice { get; private set; }

}