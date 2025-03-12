

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
using ReceiptApp.Application.UseCases.Store.Command.CreateStore;
using ReceiptApp.Application.UseCases.Store.Command.DeleteStore;
using ReceiptApp.Application.UseCases.Store.Command.UpdateStore;
using ReceiptApp.Application.UseCases.Store.Query.GetStoreById;
using ReceiptApp.Application.UseCases.Store.Query.GetStores;
using ReceiptApp.Presentation.Abstraction;
using Shared.Contracts.Receipts.Requests;
using Shared.Contracts.Stores.Requests;

namespace ReceiptApp.Presentation.Controllers;

[Route("api/stores")]
[ApiController]
[Authorize]
public sealed class StoreController : ApiController
{
    public StoreController(ISender sender)
        : base(sender)
    {
    }

    [HttpPost]
    public async Task<IActionResult> CreateStore(
        [FromBody] CreateStoreRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateStoreCommand(
            request.Name,
            request.Address
        );

        Guid guid = await Sender.Send(command, cancellationToken);
        
        return Created("api/stores", new { id = guid });             
    }
    
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateStore(
        Guid id,
        [FromBody] UpdateStoreRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateStoreCommand(
            id,
            request.Name,
            request.Address
        );

        await Sender.Send(command, cancellationToken);
        
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteStore(Guid id, CancellationToken cancellationToken)
    {
        var command = new DeleteStoreCommand(id);

        await Sender.Send(command, cancellationToken);
        
        return NoContent();
    }
    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetStoreByIdQuery(id);
        var store = await Sender.Send(query, cancellationToken);

        if (store is null)
        {
            return NotFound();
        }

        return Ok(store);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserStores(
        [FromQuery] StoreFilter filter,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetStoresQuery
        {
            Filter = filter,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var stores = await Sender.Send(query, cancellationToken);

        return Ok(stores);
    }
}
