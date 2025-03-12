using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.Statistics;

namespace ReceiptApp.Application.UseCases.Statistics.Query.GetAnnualStatistics;


public sealed record GetAnnualStatisticsQuery(int Year) : IQuery<AnnualStatistics>;