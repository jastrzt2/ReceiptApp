using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.Statistics;

namespace ReceiptApp.Application.UseCases.Statistics.Query.GetMonthlyDailyStatistics;


public sealed record GetMonthlyDailyStatisticsQuery(int Year, int Month) : IQuery<MonthlyDailyStatistics>;