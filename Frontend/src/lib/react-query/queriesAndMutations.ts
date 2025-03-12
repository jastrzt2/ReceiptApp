import { INewUser } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    createReceipt, 
    createReceiptItem, 
    createStore, 
    createUserAccount, 
    deleteReceiptById, 
    deleteReceiptItem, 
    deleteStore, 
    getAnnualStatistics, 
    getMonthlyCategoryStatistics, 
    getMonthlyDailyStatistics, 
    getReceiptById, 
    getReceiptItemById, 
    getReceiptItems, 
    getReceipts, 
    getStoreById, 
    getUserStores, 
    signInAccount, 
    signOutAccount, 
    updateReceiptById, 
    updateReceiptItem, 
    updateStore
} from "../api/api";
import { ICreateReceiptRequest, IReceiptFilter, IUpdateReceiptRequest } from "@/types/contracts/receipts/receiptContract";
import { QUERY_KEYS } from "./queryKeys";
import { ICreateStoreRequest, IStoreFilter, IUpdateStoreRequest } from "@/types/contracts/stores/storesContract";
import { ICreateReceiptItemRequest, IReceiptItemFilter, IUpdateReceiptItemRequest } from "@/types/contracts/receipttems/receiptItemsContract";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
        onSuccess: () => {
        },
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) => signInAccount(user),
        onSuccess: () => {
        },
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
        onSuccess: () => {
        },
    });
};

export const useCreateReceipt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (receipt: ICreateReceiptRequest) => createReceipt(receipt),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPTS],
            });
        },
    });
};

export const useGetReceiptById = (receiptId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECEIPT_BY_ID, receiptId],
        queryFn: () => getReceiptById(receiptId),
    });
};

export const useDeleteReceiptById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (receiptId: string) => deleteReceiptById(receiptId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPTS],
            });
        },
    });
};

export const useUpdateReceipt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ receiptId, updatedReceiptData }: { receiptId: string; updatedReceiptData: IUpdateReceiptRequest }) =>
            updateReceiptById(receiptId, updatedReceiptData),
        onSuccess: (_, variables) => {
            const { receiptId } = variables;
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPT_BY_ID, receiptId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPTS],
            });
        },
    });
};


export const useGetReceipts = (filter: IReceiptFilter, pageNumber = 1, pageSize = 20) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECEIPTS, filter, pageNumber, pageSize],
        queryFn: () => getReceipts(filter, pageNumber, pageSize),
    });
};


export const useCreateStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (storeData: ICreateStoreRequest) => createStore(storeData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_STORES],
            });
        },
    });
};

export const useUpdateStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ storeId, updatedStoreData }: { storeId: string; updatedStoreData: IUpdateStoreRequest }) => updateStore(storeId, updatedStoreData),
        onSuccess: (_, variables) => {
            const { storeId } = variables;
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_STORE_BY_ID, storeId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_STORES],
            });
        },
    });
};

export const useDeleteStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (storeId: string) => deleteStore(storeId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_STORES],
            });
        },
    });
};

export const useGetStoreById = (storeId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_STORE_BY_ID, storeId],
        queryFn: () => getStoreById(storeId),
    });
};


export const useGetUserStores = (filter: IStoreFilter, pageNumber = 1, pageSize = 20) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_STORES, filter, pageNumber, pageSize],
        queryFn: () => getUserStores(filter, pageNumber, pageSize),
    });
};

export const useCreateReceiptItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (receiptItemData: ICreateReceiptItemRequest) => createReceiptItem(receiptItemData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPT_ITEMS],
            });
        },
    });
};

export const useUpdateReceiptItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updatedReceiptItemData }: { id: string; updatedReceiptItemData: IUpdateReceiptItemRequest }) => 
            updateReceiptItem(id, updatedReceiptItemData),
        onSuccess: (_, variables) => {
            const { id } = variables;
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPT_ITEM_BY_ID, id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPT_ITEMS],
            });
        },
    });
};

export const useDeleteReceiptItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteReceiptItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECEIPT_ITEMS],
            });
        },
    });
};

export const useGetReceiptItemById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECEIPT_ITEM_BY_ID, id],
        queryFn: () => getReceiptItemById(id),
    });
};

export const useGetReceiptItems = (filter: IReceiptItemFilter, pageNumber = 1, pageSize = 20) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECEIPT_ITEMS, filter, pageNumber, pageSize],
        queryFn: () => getReceiptItems(filter, pageNumber, pageSize),
    });
};

export const useGetAnnualStatistics = (year: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ANNUAL_STATISTICS, year],
        queryFn: () => getAnnualStatistics(year),
    });
};

export const useGetMonthlyCategoryStatistics = (year: number, month: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_MONTHLY_CATEGORY_STATISTICS, year, month],
        queryFn: () => getMonthlyCategoryStatistics(year, month),
    });
};

export const useGetMonthlyDailyStatistics = (year: number, month: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_MONTHLY_DAILY_STATISTICS, year, month],
        queryFn: () => getMonthlyDailyStatistics(year, month),
    });
};
