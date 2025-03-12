import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useGetReceiptItems } from '@/lib/react-query/queriesAndMutations';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import ReceiptItemGrid from '@/components/shared/ReceiptItemGrid';
import { ProductCategory, TaxationType } from '@/types/contracts/enums';

const MAX_PRODUCT_NAME_LENGTH = 100;

export const filterFormSchema = z
    .object({
        receiptId: z.string().optional(),

        productName: z
            .string()
            .max(MAX_PRODUCT_NAME_LENGTH, { message: `Product name can't exceed ${MAX_PRODUCT_NAME_LENGTH} characters` })
            .optional(),

        productCategory: z.any().optional(),

        minQuantity: z
            .preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number()
                .int({ message: "Min quantity must be an integer" })
                .min(0, { message: "Min quantity can't be less than 0" })
            )
            .optional(),

        maxQuantity: z
            .preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number()
                .int({ message: "Max quantity must be an integer" })
                .min(0, { message: "Max quantity can't be less than 0" })
            )
            .optional(),

        minProductPrice: z
            .preprocess((val) => (val === "" ? undefined : parseFloat(val as string)), z.number()
                .min(0, { message: "Min product price can't be less than 0" })
                .refine((val) => Math.round(val * 100) === val * 100, {
                    message: "Min product price cannot have more than two decimal places",
                })
            )
            .optional(),

        maxProductPrice: z
            .preprocess((val) => (val === "" ? undefined : parseFloat(val as string)), z.number()
                .min(0, { message: "Max product price can't be less than 0" })
                .refine((val) => Math.round(val * 100) === val * 100, {
                    message: "Max product price cannot have more than two decimal places",
                })
            )
            .optional(),

            taxationType: z.any().optional(),
    })
    .refine(
        (data) => {
            if (data.minQuantity !== undefined && data.maxQuantity !== undefined) {
                return data.minQuantity <= data.maxQuantity;
            }
            return true;
        },
        {
            message: "Min quantity cannot be greater than max quantity",
            path: ["minQuantity"],
        }
    )
    .refine(
        (data) => {
            if (data.minProductPrice !== undefined && data.maxProductPrice !== undefined) {
                return data.minProductPrice <= data.maxProductPrice;
            }
            return true;
        },
        {
            message: "Min product price cannot be greater than max product price",
            path: ["minProductPrice"],
        }
    );

const ReceiptItemsPage = () => {
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const form = useForm<z.infer<typeof filterFormSchema>>({
        resolver: zodResolver(filterFormSchema),
        defaultValues: {
            receiptId: '',
            productName: '',
            productCategory: undefined,
            minQuantity: undefined,
            maxQuantity: undefined,
            minProductPrice: undefined,
            maxProductPrice: undefined,
            taxationType: undefined,
        },
    });

    const [filterData, setFilterData] = useState(form.getValues());
    const { data: receiptItems, isLoading, isError, refetch } = useGetReceiptItems(filterData, page, pageSize);

    const navigate = useNavigate();

    const onSubmit = (data: z.infer<typeof filterFormSchema>) => {
        setPage(1);
        setFilterData(data);
        refetch();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        refetch();
    };

    const handleGoToFirstPage = () => {
        setPage(1);
        refetch();
    };

    const handleGoToLastPage = () => {
        const lastPage = Math.ceil((receiptItems?.totalCount || 0) / pageSize);
        setPage(lastPage);
        refetch();
    };

    const pageRange = Array.from({ length: 5 }, (_, index) => page - 2 + index)
        .filter((pageNumber) => pageNumber > 0 && pageNumber <= Math.ceil((receiptItems?.totalCount || 0) / pageSize));

    const hasReceiptItems = receiptItems?.totalCount > 0;
    const lastPage = Math.ceil((receiptItems?.totalCount || 0) / pageSize);

    return (
        <div className="receipt-items-page p-6">
            <div className="mb-6 flex justify-end">
                <Button
                    className="bg-primary-500 hover:bg-primary-600 text-light-1"
                    onClick={() => navigate('/receiptItem/create')}
                >
                    Add Receipt Item
                </Button>
            </div>

            <div className="filters mt-8">
                <h2 className="h4-bold mb-4">Filters</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="receiptId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Receipt ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input text-black"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input text-black"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="minQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input text-black"
                                            type="number"
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input text-black"
                                            type="number"
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="minProductPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input text-black"
                                            type="number"
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxProductPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input text-black"
                                            type="number"
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex space-x-4">
                            <FormField
                                control={form.control}
                                name="taxationType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Taxation Type  </FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="shad-input text-black text-lg py-2 px-4"
                                                value={field.value ?? ''}
                                            >
                                                <option value="">Any</option>
                                                {Object.values(TaxationType).map((taxType) => (
                                                    <option key={taxType} value={taxType}>
                                                        {taxType}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="productCategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Category  </FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="shad-input text-black text-lg py-2 px-4"
                                                value={field.value ?? ''}
                                            >
                                                <option value="">Any</option> {/* "Any" option */}
                                                {Object.values(ProductCategory).map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full md:col-span-2 bg-primary-500 hover:bg-primary-600 text-light-1"
                        >
                            Apply Filters
                        </Button>
                    </form>
                </Form>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div>Error fetching data</div>
            ) : (
                <>
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold">Receipt Items Found: {receiptItems?.totalCount}</h3>
                    </div>

                    <ReceiptItemGrid receiptItems={receiptItems.items} />
                </>
            )}

            <div className="pagination flex items-center gap-2 justify-center mt-8">
                <Button
                    variant="outline"
                    disabled={page === 1 || !hasReceiptItems}
                    onClick={handleGoToFirstPage}
                >
                    First
                </Button>
                <Button
                    variant="outline"
                    disabled={page === 1 || !hasReceiptItems}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </Button>

                {pageRange.map((pageNum) => (
                    <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                    >
                        {pageNum}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    disabled={page === lastPage || !hasReceiptItems}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </Button>
                <Button
                    variant="outline"
                    disabled={page === lastPage || !hasReceiptItems}
                    onClick={handleGoToLastPage}
                >
                    Last
                </Button>
            </div>
        </div>
    );
};

export default ReceiptItemsPage;
