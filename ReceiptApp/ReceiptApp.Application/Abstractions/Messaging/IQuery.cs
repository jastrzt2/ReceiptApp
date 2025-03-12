using MediatR;

namespace ReceiptApp.Application.Abstractions.Messaging;

public interface IQuery<TResponse> : IRequest<TResponse>
{
}