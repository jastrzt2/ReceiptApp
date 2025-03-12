using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces.Read;
using Shared.Contracts.Statistics;

namespace ReceiptApp.Application.UseCases.Statistics.Query.GetAnnualStatistics;

public class GetAnnualStatisticsQueryHandler : IQueryHandler<GetAnnualStatisticsQuery, AnnualStatistics>
{
    private readonly IReceiptReadRepository _receiptReadRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetAnnualStatisticsQueryHandler(IReceiptReadRepository receiptReadRepository, IHttpContextAccessor httpContextAccessor)
    {
        _receiptReadRepository = receiptReadRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<AnnualStatistics> Handle(GetAnnualStatisticsQuery request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var expensesPerMonth = await _receiptReadRepository.GetAnnualStatisticsAsync(userId, request.Year, cancellationToken);
        return new AnnualStatistics
        {
            ExpensesPerMonth = expensesPerMonth
        };
    }
}