using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Shared.Contracts.Users;

namespace ReceiptApp.Application.UseCases.User;

public class GetUserInfoQueryHandler : IRequestHandler<GetUserContextRequest, UserContextRequest>
{
    private readonly UserManager<Domain.Models.Users.User> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetUserInfoQueryHandler(UserManager<Domain.Models.Users.User> userManager, IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<UserContextRequest> Handle(GetUserContextRequest request, CancellationToken cancellationToken)
    {
        var userId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return null;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;

        return new UserContextRequest
        {
            Email = user.Email,
            UserId = user.Id
        };
    }
}