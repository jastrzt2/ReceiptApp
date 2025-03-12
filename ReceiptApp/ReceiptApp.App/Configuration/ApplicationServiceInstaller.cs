namespace ReceiptApp.App.Configuration;

public class ApplicationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Application.AssemblyReference.Assembly));
    
        //services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationPipelineBehavior<,>));

        // services.Decorate(typeof(INotificationHandler<>), typeof(IdempotentDomainEventHandler<>));

        //services.AddValidatorsFromAssembly(
        //    MediaTypeNames.Application.AssemblyReference.Assembly,
         //   includeInternalTypes: true);
    }
}
