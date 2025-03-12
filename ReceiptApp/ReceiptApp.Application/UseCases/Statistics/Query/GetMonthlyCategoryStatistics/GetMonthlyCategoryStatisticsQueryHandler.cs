using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using ReceiptApp.Application.UseCases.Statistics.Query.GetMonthlyCategoryStatistics;
using ReceiptApp.Domain.Exceptions.StatisticsException;
using Shared.Contracts.Statistics;

namespace ReceiptApp.Application.UseCases.Statistics.Query.GetMonthlyCategoryStatistics;

public class GetMonthlyCategoryStatisticsQueryHandler : IQueryHandler<GetMonthlyCategoryStatisticsQuery, MonthlyCategoryStatistics>
{

    private readonly IReceiptItemReadRepository _receiptItemReadRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetMonthlyCategoryStatisticsQueryHandler(IReceiptItemReadRepository receiptItemReadRepository, IHttpContextAccessor httpContextAccessor)
    {
        _receiptItemReadRepository = receiptItemReadRepository;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<MonthlyCategoryStatistics> Handle(GetMonthlyCategoryStatisticsQuery request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (request.Month < 1 || request.Month > 12)
        {
            throw new BadMonthRequest();
        }
            
        var monthlyStatistics = await _receiptItemReadRepository.GetMonthlyCategoryStatisticsAsync(userId, request.Year, request.Month, cancellationToken);
        return new MonthlyCategoryStatistics
        {
            ExpensesByCategory = monthlyStatistics
        };
    }
}