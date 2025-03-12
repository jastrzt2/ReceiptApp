using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.Receipts.Responses;

namespace ReceiptApp.Application.UseCases.Receipts.Query.GetReceiptById;

public sealed record GetReceiptByIdQuery
(Guid ReceiptId) : IQuery<ReceiptResponse>;
