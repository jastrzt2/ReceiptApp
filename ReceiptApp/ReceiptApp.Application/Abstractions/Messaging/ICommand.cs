﻿using MediatR;

namespace ReceiptApp.Application.Abstractions.Messaging;

public interface ICommand : IRequest
{
}

public interface ICommand<TResponse> : IRequest<TResponse>
{
}
