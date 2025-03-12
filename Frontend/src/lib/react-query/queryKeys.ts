export enum QUERY_KEYS {
    CREATE_USER_ACCOUNT = "createUserAccount",
    SIGN_IN_ACCOUNT = "signInAccount",
    SIGN_OUT_ACCOUNT = "signOutAccount",
    CREATE_RECEIPT = "createReceipt",
    GET_RECEIPT_BY_ID = "getReceiptById",
    DELETE_RECEIPT_BY_ID = "deleteReceiptById",
    UPDATE_RECEIPT_BY_ID = "updateReceiptById",
    GET_RECEIPTS = "getReceipts",

    
    GET_USER_STORES = "useGetUserStores",
    GET_STORE_BY_ID = "useGetStoreById",
    GET_RECEIPT_ITEM_BY_ID = "useGetReceiptItemById",
    GET_RECEIPT_ITEMS = "useGetReceiptItems",
    
    GET_ANNUAL_STATISTICS = "useGetAnnualStatistics",
    GET_MONTHLY_CATEGORY_STATISTICS = "useGetMonthlyCategoryStatistics",
    GET_MONTHLY_DAILY_STATISTICS = "useGetMonthlyDailyStatistics",
}