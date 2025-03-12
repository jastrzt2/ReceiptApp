using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace ReceiptApp.Presentation.Abstraction;

[ApiController]
public abstract class ApiController : ControllerBase
{
    protected readonly ISender Sender;
    
    protected ApiController(ISender sender) => Sender = sender;
    
    
}