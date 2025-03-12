using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReceiptApp.Application.UseCases.Statistics.Query.GetAnnualStatistics;
using ReceiptApp.Application.UseCases.Statistics.Query.GetMonthlyCategoryStatistics;
using ReceiptApp.Application.UseCases.Statistics.Query.GetMonthlyDailyStatistics;
using Shared.Contracts.Statistics;
using ReceiptApp.Presentation.Abstraction;

namespace ReceiptApp.Presentation.Controllers
{
    [Route("api/statistics")]
    [ApiController]
    [Authorize]
    public sealed class StatisticsController : ApiController
    {
        public StatisticsController(ISender sender)
            : base(sender)
        {
        }

        [HttpGet("annual/{year:int}")]
        public async Task<IActionResult> GetAnnualStatistics(
            int year,
            CancellationToken cancellationToken = default)
        {
            var query = new GetAnnualStatisticsQuery(year);

            var annualStatistics = await Sender.Send(query, cancellationToken);

            return Ok(annualStatistics);
        }

        [HttpGet("monthly/category/{year:int}/{month:int}")]
        public async Task<IActionResult> GetMonthlyCategoryStatistics(
            int year,
            int month,
            CancellationToken cancellationToken = default)
        {
            

            var query = new GetMonthlyCategoryStatisticsQuery(year, month);

            var monthlyCategoryStatistics = await Sender.Send(query, cancellationToken);

            return Ok(monthlyCategoryStatistics);
        }

        [HttpGet("monthly/daily/{year:int}/{month:int}")]
        public async Task<IActionResult> GetMonthlyDailyStatistics(
            int year,
            int month,
            CancellationToken cancellationToken = default)
        {

            var query = new GetMonthlyDailyStatisticsQuery(year, month);

            var monthlyDailyStatistics = await Sender.Send(query, cancellationToken);

            return Ok(monthlyDailyStatistics);
        }
    }
}
