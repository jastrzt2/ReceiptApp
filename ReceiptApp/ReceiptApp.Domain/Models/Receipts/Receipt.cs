using ReceiptApp.Domain.Exceptions.UsersExceptions;
using ReceiptApp.Domain.Models.Stores;
using ReceiptApp.Domain.Models.Users;
using ReceiptApp.Domain.Primitives;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ReceiptApp.Domain.Exceptions.ReceiptExceptions;
using ReceiptApp.Domain.Models.ReceiptItems;
using StoreIdEmptyException = ReceiptApp.Domain.Exceptions.StoreExceptions.StoreIdEmptyException;

namespace ReceiptApp.Domain.Models.Receipts;

public class Receipt : IAuditableEntity
{
    public Guid ReceiptId { get; private set; }
    private List<ReceiptItem> _receiptItems = new List<ReceiptItem>();
    public IReadOnlyList<ReceiptItem> ReceiptItems => _receiptItems.AsReadOnly();
    public string UserId { get; private set; }
    public User User { get; private set; }
    public Guid? StoreId { get; private set; }
    public Store Store { get; private set; }
    public decimal TotalPLN { get; private set; }
    public decimal TotalTax { get; private set; }
    public string PaymentType { get; private set; }
    public decimal? Change { get; private set; }
    public string Comment { get; private set; }
    public DateTime IssuedAt { get; private set; }
    public DateTime CreatedOnUtc { get; }
    public DateTime? ModifiedOnUtc { get; }

    private Receipt()
    {
    }

    private Receipt(
        Guid receiptId,
        List<ReceiptItem> receiptItems,
        string userId,
        User user,
        Guid? storeId,
        Store store,
        decimal totalPLN,
        decimal totalTax,
        string paymentType,
        decimal? change,
        string comment,
        DateTime issuedAt)
    {
        ReceiptId = receiptId;
        _receiptItems = receiptItems;
        UserId = userId;
        User = user;
        StoreId = storeId;
        Store = storeId.HasValue ? store : null;
        TotalPLN = totalPLN;
        TotalTax = totalTax;
        PaymentType = paymentType;
        Change = change;
        Comment = comment;
        IssuedAt = issuedAt;
        CreatedOnUtc = DateTime.UtcNow;
    }

    public static Receipt Create(
        Guid receiptId,
        List<ReceiptItem> receiptItems,
        string userId,
        User user,
        Guid? storeId,
        Store store,
        decimal totalPLN,
        decimal totalTax,
        string paymentType,
        decimal? change,
        string comment,
        DateTime issuedAt)
    {
        if (receiptId == Guid.Empty)
        {
            throw new ReceiptIdEmptyException();
        }

        if (totalPLN <= 0)
        {
            throw new TotalPLNInvalidException();
        }

        if (totalTax < 0)
        {
            throw new TotalTaxInvalidException();
        }
        
        if (totalTax > totalPLN)
        {
            throw new TotalTaxGreaterThanTotalPLNException();
        }
        
        if (string.IsNullOrWhiteSpace(paymentType))
        {
            throw new PaymentTypeEmptyException();
        }

        if (issuedAt > DateTime.UtcNow)
        {
            throw new IssuedAtInvalidException();
        }
        
        if ( paymentType.Length > PaymentTypeTooLongException.MAX_LENGTH)
            throw new PaymentTypeTooLongException();
        
        if ( paymentType.Length > CommentTooLongException.MAX_LENGTH)
            throw new CommentTooLongException();
        
        return new Receipt(
            receiptId,
            receiptItems,
            userId,
            user,
            storeId,
            store,
            totalPLN,
            totalTax,
            paymentType,
            change,
            comment,
            issuedAt
        );
    }
    
    public void Update(
        string? userId = null,
        User? user = null,
        Guid? storeId = null,
        Store? store = null,
        decimal? totalPLN = null,
        decimal? totalTax = null,
        string? paymentType = null,
        decimal? change = null,
        string? comment = null,
        DateTime? issuedAt = null)
    {
        if (userId is not null)
        {
            UserId = userId;
        }
        
        if (user is not null)
        {
            User = user;
        }
    
        if (storeId.HasValue)
        {
            StoreId = storeId;
        }
        
        if (store is not null)
        {
            Store = store;
        }

        if (totalPLN.HasValue)
        {
            if (totalPLN.Value <= 0)
                throw new TotalPLNInvalidException();
            TotalPLN = totalPLN.Value;
        }

        if (totalTax.HasValue)
        {
            if (totalTax.Value < 0)
                throw new TotalTaxInvalidException();
            TotalTax = totalTax.Value;
        }

        if (paymentType is not null)
        {
            if (paymentType.Length > PaymentTypeTooLongException.MAX_LENGTH)
                throw new PaymentTypeTooLongException();
            PaymentType = paymentType;
        }

        if (change.HasValue)
        {
            Change = change.Value;
        }

        if (comment is not null)
        {
            if (comment.Length > CommentTooLongException.MAX_LENGTH)
                throw new CommentTooLongException();
            Comment = comment;
        }

        if (issuedAt.HasValue)
        {
            if (issuedAt.Value > DateTime.UtcNow)
                throw new IssuedAtInvalidException();
            IssuedAt = issuedAt.Value;
        }
    }

}