using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReceiptApp.Application.UseCases.ReceiptItems.Command.CreateReceiptItem;
using ReceiptApp.Application.UseCases.ReceiptItems.Command.DeleteReceiptItem;
using ReceiptApp.Application.UseCases.ReceiptItems.Command.UpdateReceiptItem;
using ReceiptApp.Application.UseCases.ReceiptItems.Query.GetReceiptItemById;
using ReceiptApp.Application.UseCases.ReceiptItems.Query.GetReceiptItems;
using ReceiptApp.Application.UseCases.Receipts.Command.CreateReceipt;
using ReceiptApp.Application.UseCases.Receipts.Command.DeleteReceipt;
using ReceiptApp.Application.UseCases.Receipts.Command.UpdateReceipt;
using ReceiptApp.Application.UseCases.Receipts.Query.GetReceiptById;
using ReceiptApp.Application.UseCases.Receipts.Query.GetUserReceipts;
using ReceiptApp.Presentation.Abstraction;
using Shared.Contracts.ReceiptItems.Requests;
using Shared.Contracts.Receipts.Requests;

namespace ReceiptApp.Presentation.Controllers;

[Route("api/receiptitems")]
[ApiController]
[Authorize]
public sealed class ReceiptItemController : ApiController
{
    public ReceiptItemController(ISender sender)
        : base(sender)
    {
    }

    [HttpPost]
    public async Task<IActionResult> CreateReceipt(
        [FromBody] CreateReceiptItemRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateReceiptItemCommand(
            request.ReceiptId,
            request.ProductName,
            request.Quantity,
            request.ProductPrice,
            request.TaxationType,
            request.ProductCategory
        );

        Guid guid = await Sender.Send(command, cancellationToken);

        return Created("api/receiptitems", new { id = guid });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateReceiptItem(
        Guid id,
        [FromBody] UpdateReceiptItemRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateReceiptItemCommand(
            id,
            request.ReceiptId,
            request.ProductName,
            request.Quantity,
            request.ProductPrice,
            request.TaxationType,
            request.ProductCategory
        );

        await Sender.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteReceiptItem(Guid id, CancellationToken cancellationToken)
    {
        var command = new DeleteReceiptItemCommand(id);

        await Sender.Send(command, cancellationToken);

        return NoContent();
    }
    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetReceiptItemByIdQuery(id);
        var receiptItem = await Sender.Send(query, cancellationToken);

        if (receiptItem is null)
        {
            return NotFound();
        }

        return Ok(receiptItem);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserReceipts(
        [FromQuery] ReceiptItemFilter filter,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        
        var query = new GetReceiptItemQuery
        {
            Filter = filter,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        
        var receiptItems = await Sender.Send(query, cancellationToken);

        return Ok(receiptItems);
    }
}
