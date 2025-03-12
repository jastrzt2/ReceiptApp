import { ProductCategory, TaxationType } from "./../enums";

export type ICreateReceiptItemRequest = {
    receiptId: string;  
    productName: string;
    quantity: number;
    productPrice: number;
    taxationType: number;
    productCategory: number;
  }
  
  export type IReceiptItemFilter = {
    receiptId?: string; 
    productName?: string;
    minQuantity?: number;
    maxQuantity?: number;
    minProductPrice?: number;
    maxProductPrice?: number;
    taxationType?: TaxationType;
    productCategory?: ProductCategory;
  }
  
  export type IUpdateReceiptItemRequest = {
    receiptId?: string; 
    productName?: string;
    quantity?: number;
    productPrice?: number;
    taxationType?: number;
    productCategory?: number;
  }

  
  export type IReceiptItemResponse = {
    receiptItemId: string; 
    receiptId: string; 
    productName: string;
    quantity: number;
    productPrice: number;
    taxationType: TaxationType;
    productCategory: ProductCategory;
    createdOnUtc: string; 
    modifiedOnUtc?: string; 
  }