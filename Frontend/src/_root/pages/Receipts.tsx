import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { IReceiptResponse } from '@/types/contracts/receipts/receiptContract';
import { Link } from 'react-router-dom';
import { useGetReceipts } from '@/lib/react-query/queriesAndMutations';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

// Schema walidacji dla formularza
const filterFormSchema = z.object({
    minTotalPLN: z.number().optional(),
    maxTotalPLN: z.number().optional(),
    minTotalTax: z.number().optional(),
    maxTotalTax: z.number().optional(),
    paymentType: z.string().optional(),
    startIssuedAt: z.string().optional(),
    endIssuedAt: z.string().optional(),
}).refine((data) => {
    if (data.startIssuedAt && data.endIssuedAt) {
        const startDate = new Date(data.startIssuedAt);
        const endDate = new Date(data.endIssuedAt);
        return startDate <= endDate;
    }
    return true;
}, {
    message: "Start date must be earlier than or equal to end date",
    path: ["endIssuedAt"], // pokazuje błąd przy polu end date
});

const ReceiptPage = () => {
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const form = useForm<z.infer<typeof filterFormSchema>>({
        resolver: zodResolver(filterFormSchema),
        defaultValues: {
            minTotalPLN: undefined,
            maxTotalPLN: undefined,
            minTotalTax: undefined,
            maxTotalTax: undefined,
            paymentType: '',
            startIssuedAt: '',
            endIssuedAt: '',
        },
    });

    const { data: receipts, isLoading, isError, refetch } = useGetReceipts(form.getValues(), page, pageSize);

    const onSubmit = (data: z.infer<typeof filterFormSchema>) => {
        if (data.startIssuedAt) {
            data.startIssuedAt = `${data.startIssuedAt}:00.000Z`;
        }
        if (data.endIssuedAt) {
            data.endIssuedAt = `${data.endIssuedAt}:00.000Z`;
        }

        setPage(1);
        refetch();
    };

    const validateDates = (startDate: string, endDate: string) => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return start <= end;
        }
        return true;
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const newStartDate = e.target.value;
        const currentEndDate = form.getValues("endIssuedAt");

        field.onChange(newStartDate);

        if (currentEndDate && !validateDates(newStartDate, currentEndDate)) {
            form.setError("endIssuedAt", {
                type: "manual",
                message: "End date must be later than or equal to start date"
            });
        } else {
            form.clearErrors("endIssuedAt");
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const newEndDate = e.target.value;
        const currentStartDate = form.getValues("startIssuedAt");

        field.onChange(newEndDate);

        if (currentStartDate && !validateDates(currentStartDate, newEndDate)) {
            form.setError("endIssuedAt", {
                type: "manual",
                message: "End date must be later than or equal to start date"
            });
        } else {
            form.clearErrors("endIssuedAt");
        }
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
        const lastPage = Math.ceil((receipts?.totalCount || 0) / pageSize);
        setPage(lastPage);
        refetch();
    };

    const pageCount = Math.ceil((receipts?.totalCount || 0) / pageSize);

    const pageRange = Array.from({ length: 5 }, (_, index) => page - 2 + index)
        .filter((pageNumber) => pageNumber > 0 && pageNumber <= pageCount);

    // Zmienna określająca, czy istnieje więcej niż jedna strona
    const hasPages = pageCount > 1;

    return (
        <div className="receipt-page p-6">
            <div className="filters mt-8">
                <h2 className="h4-bold mb-4">Filters</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="minTotalPLN"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Total PLN</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
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
                            name="maxTotalPLN"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Total PLN</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
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
                            name="minTotalTax"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Total Tax</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
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
                            name="maxTotalTax"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Total Tax</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
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
                            name="paymentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Type</FormLabel>
                                    <FormControl>
                                        <Input className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startIssuedAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Issued At</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="datetime-local" 
                                            className="shad-input text-black" 
                                            {...field} 
                                            onChange={(e) => handleStartDateChange(e, field)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endIssuedAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Issued At</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="datetime-local" 
                                            className="shad-input text-black" 
                                            {...field} 
                                            onChange={(e) => handleEndDateChange(e, field)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                        <h3 className="text-lg font-semibold">Receipts Found: {receipts?.totalCount}</h3>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {receipts?.items?.length > 0 ? (
                            receipts.items.map((receipt: IReceiptResponse) => (
                                <li key={receipt.receiptId} className="border p-4 rounded-lg hover:bg-gray-800 transition-colors">
                                    <Link to={`/receipt/${receipt.receiptId}`}>
                                        <h3 className="font-bold">Receipt {receipt.receiptId}</h3>
                                        <p>Total: {receipt.totalPLN} PLN</p>
                                        <p>Tax: {receipt.totalTax} PLN</p>
                                        <p>Change: {receipt.change} PLN</p>
                                        <p>Issued At: {new Date(receipt.issuedAt).toLocaleString()}</p>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <p>No receipts found</p>
                        )}
                    </ul>
                </>
            )}

            <div className="pagination flex items-center gap-2 justify-center mt-8">
                <Button 
                    variant="outline" 
                    disabled={page === 1 || !hasPages} 
                    onClick={handleGoToFirstPage}
                >
                    First
                </Button>
                <Button 
                    variant="outline" 
                    disabled={page === 1 || !hasPages} 
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
                    disabled={page === pageCount || !hasPages} 
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </Button>
                <Button 
                    variant="outline" 
                    disabled={page === pageCount || !hasPages} 
                    onClick={handleGoToLastPage}
                >
                    Last
                </Button>
            </div>
        </div>
    );
};

export default ReceiptPage;
