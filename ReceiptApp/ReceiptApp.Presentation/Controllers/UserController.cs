using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using ReceiptApp.Application.UseCases.User;
using ReceiptApp.Domain.Models.Users;
using ReceiptApp.Presentation.Abstraction;
using Shared.Contracts.Users;

namespace ReceiptApp.Presentation.Controllers;

[Route("api/users")]
[ApiController]
public sealed class UserController : ApiController
{
    private readonly SignInManager<User> _signInManager;

    public UserController(ISender sender, SignInManager<User> signInManager)
        : base(sender)
    {
        _signInManager = signInManager;
    }

    [HttpGet("context")]
    public async Task<ActionResult<UserContextRequest>> GetUserInfo(CancellationToken cancellationToken)
    {
        var request = new GetUserContextRequest();
        var userInfo = await Sender.Send(request, cancellationToken);

        if (userInfo == null)
        {
            return NotFound();
        }

        return Ok(userInfo);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await _signInManager.SignOutAsync();

        Response.Cookies.Delete("ReceiptAppCookie");

        return Ok(new { message = "Logged out successfully" });
    }
}