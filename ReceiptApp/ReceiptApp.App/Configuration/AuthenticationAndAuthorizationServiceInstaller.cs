using Microsoft.AspNetCore.Identity;
using ReceiptApp.Domain.Models.Users;
using ReceiptApp.Infrastructure.Database.Contexts;

namespace ReceiptApp.App.Configuration;

public class AuthenticationAndAuthorizationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentityCore<User>().
            AddEntityFrameworkStores<WriteDbContext>().
            AddApiEndpoints();
        
        services.AddAuthorization();
        services.AddAuthentication(IdentityConstants.ApplicationScheme)
            .AddCookie(IdentityConstants.ApplicationScheme, options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.Name = "ReceiptAppCookie";
            });
        services.AddHttpContextAccessor();


    }
}
