using ReceiptApp.Application.Abstractions.Messaging;
using ReceiptApp.Application.RepositoryInterfaces;
using ReceiptApp.Application.RepositoryInterfaces.Write;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Models.ReceiptItems;
using ReceiptApp.Domain.Models.Receipts;

namespace ReceiptApp.Application.UseCases.ReceiptItems.Command.CreateReceiptItem;

internal sealed class CreateReceiptItemCommandHandler : ICommandHandler<CreateReceiptItemCommand, Guid>
{
    private readonly IReceiptItemRepository _receiptItemRepository;
    private readonly IReceiptRepository _receiptRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateReceiptItemCommandHandler(
        IReceiptItemRepository receiptItemRepository,
        IReceiptRepository receiptRepository,
        IUnitOfWork unitOfWork)
    {
        _receiptItemRepository = receiptItemRepository;
        _receiptRepository = receiptRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateReceiptItemCommand request, CancellationToken cancellationToken)
    {
        Receipt? receipt = _receiptRepository.GetByIdAsync(request.ReceiptId, cancellationToken).Result;

        if (receipt == null)
        {
            throw new ReceiptNotFound(request.ReceiptId);
        }
        
        var receiptItem = ReceiptItem.Create(
            receiptItemId: Guid.NewGuid(),
            receiptId: request.ReceiptId,
            receipt: null,
            productName: request.ProductName,
            quantity: request.Quantity,
            productPrice: request.ProductPrice,
            taxationType: request.TaxationType,
            productCategory: request.ProductCategory
        );

        _receiptItemRepository.Add(receiptItem);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return receiptItem.ReceiptItemId;
    }
}