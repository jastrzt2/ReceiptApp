export type ICreateReceiptRequest = {
    storeId?: string; 
    totalPLN: number;
    totalTax: number;
    paymentType: string;
    change?: number;
    comment?: string;
    issuedAt: string;  
  }
  
  export type IReceiptFilter = {
    storeId?: string;
    minTotalPLN?: number;
    maxTotalPLN?: number;
    minTotalTax?: number;
    maxTotalTax?: number;
    paymentType?: string;
    startIssuedAt?: string;
    endIssuedAt?: string;  
    comment?: string;
  }
  
  export type IUpdateReceiptRequest = {
    storeId?: string;  
    totalPLN?: number;
    totalTax?: number;
    paymentType?: string;
    change?: number;
    comment?: string;
    issuedAt?: string; 
  }
  
  export type IReceiptResponse = {
    receiptId: string;
    userId: string;
    storeId?: string; 
    totalPLN: number;
    totalTax: number;
    paymentType: string;
    change: number;
    comment?: string;
    issuedAt: string;   
  }
  