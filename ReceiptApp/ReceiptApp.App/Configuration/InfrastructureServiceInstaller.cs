using Microsoft.EntityFrameworkCore;
using ReceiptApp.Infrastructure;
using ReceiptApp.Infrastructure.Database.Contexts;
using ReceiptApp.Infrastructure.Database.Interceptors;
using Scrutor;

namespace ReceiptApp.App.Configuration;

public class InfrastructureServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        
        string connectionString = configuration.GetConnectionString("Database") ??
                                  throw new InvalidOperationException("Connection string 'Database' not found.");
        
        
        services.AddDbContext<WriteDbContext>(
            optionsBuilder => optionsBuilder.UseNpgsql(connectionString));

        services.AddDbContext<ReadDbContext>(
            optionsBuilder => optionsBuilder.UseNpgsql(connectionString));

        services
            .Scan(
                selector => selector
                    .FromAssemblies(
                        AssemblyReference.Assembly)
                    .AddClasses(false)
                    .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                    .AsMatchingInterface()
                    .WithScopedLifetime());

        services.AddSingleton<UpdateAuditableEntitiesInterceptor>();
    }
}
