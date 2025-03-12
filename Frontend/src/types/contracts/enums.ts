export enum ProductCategory {
    Groceries = "Groceries",
    HouseholdItems = "Household Items",
    PersonalCare = "PersonalCare",
    Electronics = "Electronics",
    ClothingAndAccessories = "Clothing And Accessories",
    BabyProducts = "Baby Products",
    AlcoholAndTobacco = "Alcohol And Tobacco",
    BooksAndStationery = "Books And Stationery",
    HealthAndWellness = "Health And Wellness",
    Other = "Other"
}

export enum TaxationType {
    A = "A",
    B = "B",
    C = "C"
}

export const TaxationTypeMapping: Record<TaxationType, number> = {
    [TaxationType.A]: 0,
    [TaxationType.B]: 1,
    [TaxationType.C]: 2,
};

export const ProductCategoryMapping: Record<ProductCategory, number> = {
    [ProductCategory.Groceries]: 0,
    [ProductCategory.HouseholdItems]: 1,
    [ProductCategory.PersonalCare]: 2,
    [ProductCategory.Electronics]: 3,
    [ProductCategory.ClothingAndAccessories]: 4,
    [ProductCategory.BabyProducts]: 5,
    [ProductCategory.AlcoholAndTobacco]: 6,
    [ProductCategory.BooksAndStationery]: 7,
    [ProductCategory.HealthAndWellness]: 8,
    [ProductCategory.Other]: 9,
};

export const TaxationTypeReverseMapping: Record<number, TaxationType> = {
    0: TaxationType.A,
    1: TaxationType.B,
    2: TaxationType.C,
};

export const ProductCategoryReverseMapping: Record<number, ProductCategory> = {
    0: ProductCategory.Groceries,
    1: ProductCategory.HouseholdItems,
    2: ProductCategory.PersonalCare,
    3: ProductCategory.Electronics,
    4: ProductCategory.ClothingAndAccessories,
    5: ProductCategory.BabyProducts,
    6: ProductCategory.AlcoholAndTobacco,
    7: ProductCategory.BooksAndStationery,
    8: ProductCategory.HealthAndWellness,
    9: ProductCategory.Other,
};

export const getTaxationTypeString = (value: number): TaxationType | '' => {
    return TaxationTypeReverseMapping[value] || '';
};


export const getProductCategoryString = (value: number): ProductCategory | '' => {
    return ProductCategoryReverseMapping[value] || '';
};
