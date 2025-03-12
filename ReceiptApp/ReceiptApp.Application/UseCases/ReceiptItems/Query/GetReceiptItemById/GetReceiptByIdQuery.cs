using ReceiptApp.Application.Abstractions.Messaging;
using Shared.Contracts.ReceiptItems.Responses;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Query.GetReceiptItemById;

public sealed record GetReceiptItemByIdQuery
(Guid ReceiptId) : IQuery<ReceiptItemResponse>;
