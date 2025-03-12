

using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ReceiptApp.Application.UseCases.Receipts.Command.CreateReceipt;
using ReceiptApp.Application.UseCases.Receipts.Command.DeleteReceipt;
using ReceiptApp.Application.UseCases.Receipts.Command.UpdateReceipt;
using ReceiptApp.Application.UseCases.Receipts.Query.GetReceiptById;
using ReceiptApp.Application.UseCases.Receipts.Query.GetUserReceipts;
using ReceiptApp.Presentation.Abstraction;
using Shared.Contracts.Receipts.Requests;

namespace ReceiptApp.Presentation.Controllers;

[Route("api/receipts")]
[ApiController]
[Authorize]
public sealed class ReceiptController : ApiController
{
    public ReceiptController(ISender sender)
        : base(sender)
    {
    }
        
    
    
    [HttpPost]
    public async Task<IActionResult> CreateReceipt(
        [FromBody] CreateReceiptRequest request,
        CancellationToken cancellationToken)
    {
        
        var command = new CreateReceiptCommand(
            request.StoreId,
            request.TotalPLN,
            request.TotalTax,
            request.PaymentType,
            request.Change,
            request.Comment ?? string.Empty, 
            request.IssuedAt
        );

        Guid guid = await Sender.Send(command, cancellationToken);

        
        return Created("api/receipts", new { id = guid });             
    }
    
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateReceipt(
        Guid id,
        [FromBody] UpdateReceiptRequest request,
        CancellationToken cancellationToken)
    {
        
        var command = new UpdateReceiptCommand(
            id,
            request.StoreId,
            request.TotalPLN,
            request.TotalTax,
            request.PaymentType,
            request.Change,
            request.Comment,
            request.IssuedAt
        );

        await Sender.Send(command, cancellationToken);
        
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteReceipt(Guid id, CancellationToken cancellationToken)
    {
        var command = new DeleteReceiptCommand(id);

        await Sender.Send(command, cancellationToken);
        
            return NoContent();
    }
    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetReceiptByIdQuery(id);
        var receipt = await Sender.Send(query, cancellationToken);

        if (receipt is null)
        {
            return NotFound();
        }

        return Ok(receipt);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserReceipts(
        [FromQuery] ReceiptFilter filter,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetUserReceiptsQuery
        {
            Filter = filter,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var receipts = await Sender.Send(query, cancellationToken);

        return Ok(receipts);
    }
}
