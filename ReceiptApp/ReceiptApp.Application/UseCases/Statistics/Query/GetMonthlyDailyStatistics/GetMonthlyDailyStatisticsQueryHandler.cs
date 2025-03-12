using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Domain.Exceptions.StatisticsException;
using Shared.Contracts.Statistics;

namespace ReceiptApp.Application.UseCases.Statistics.Query.GetMonthlyDailyStatistics;

public class GetMonthlyDailyStatisticsQueryHandler : IQueryHandler<GetMonthlyDailyStatisticsQuery, MonthlyDailyStatistics>
{
    private readonly IReceiptReadRepository _receiptReadRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetMonthlyDailyStatisticsQueryHandler(IReceiptReadRepository receiptReadRepository, IHttpContextAccessor httpContextAccessor)
    {
        _receiptReadRepository = receiptReadRepository;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<MonthlyDailyStatistics> Handle(GetMonthlyDailyStatisticsQuery request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        
        if (request.Month < 1 || request.Month > 12)
        {
            throw new BadMonthRequest();
        }
        
        var expensesByDay = await _receiptReadRepository.GetMonthlyDailyStatisticsAsync(userId, request.Year, request.Month, cancellationToken);
        return new MonthlyDailyStatistics
        {
            ExpensesByDay = expensesByDay
        };
    }
}