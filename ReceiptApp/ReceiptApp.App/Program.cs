using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ReceiptApp.App.Configuration;
using ReceiptApp.Domain.Models.Users;
using ReceiptApp.Infrastructure.Database.Contexts;
using ReceiptApp.Presentation.Middlewares;


WebApplicationBuilder builder = WebApplication.CreateBuilder(args);


builder.Services
    .InstallServices(
        builder.Configuration,
        typeof(IServiceInstaller).Assembly);


WebApplication app = builder.Build();

if (app.Environment.IsDevelopment() )
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

builder.Services.AddHttpContextAccessor();

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapIdentityApi<User>();

app.MapControllers();


app.Run();
