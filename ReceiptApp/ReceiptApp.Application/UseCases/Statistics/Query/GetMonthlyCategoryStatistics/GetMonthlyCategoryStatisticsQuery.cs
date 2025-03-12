using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Domain.Enums;
using Shared.Contracts.Statistics;

namespace ReceiptApp.Application.UseCases.Statistics.Query.GetMonthlyCategoryStatistics;

public sealed record GetMonthlyCategoryStatisticsQuery(int Year, int Month) : IQuery<MonthlyCategoryStatistics>;