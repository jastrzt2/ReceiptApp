export type ICreateStoreRequest = {
    name: string;
    address: string;
  }
  
  export type IStoreFilter = {
    name?: string;
    address?: string;
  }
  
  export type IUpdateStoreRequest = {
    name: string;
    address: string;
  }
  
  export type IStoreResponse = {
    storeId: string; 
    userId: string;
    name: string;
    address: string;
    createdOnUtc: string; 
    modifiedOnUtc?: string;
  }
  