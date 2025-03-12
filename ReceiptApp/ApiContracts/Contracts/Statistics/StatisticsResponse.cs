namespace Shared.Contracts.Statistics;

public class AnnualStatistics
{
    public Dictionary<int, decimal> ExpensesPerMonth { get; set; } = new Dictionary<int, decimal>();
}

public class MonthlyCategoryStatistics
{
    public Dictionary<int, decimal> ExpensesByCategory { get; set; } 
        = new Dictionary<int, decimal>();
}

public class MonthlyDailyStatistics
{
    
    public Dictionary<int, decimal> ExpensesByDay { get; set; } = new Dictionary<int, decimal>();

}