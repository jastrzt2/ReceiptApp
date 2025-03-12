import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { useGetUserStores } from '@/lib/react-query/queriesAndMutations';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import StoreGrid from '@/components/shared/StoreGrid';
import { useNavigate } from 'react-router-dom'; // Dodajemy useNavigate

const filterFormSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
});

const StoresPage = () => {
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const form = useForm<z.infer<typeof filterFormSchema>>({
        resolver: zodResolver(filterFormSchema),
        defaultValues: {
            name: '',
            address: '',
        },
    });

    const { data: stores, isLoading, isError, refetch } = useGetUserStores(form.getValues(), page, pageSize);
    const navigate = useNavigate(); // Inicjalizujemy navigate

    const onSubmit = (_data: z.infer<typeof filterFormSchema>) => {
        setPage(1);
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
        const lastPage = Math.ceil((stores?.totalCount || 0) / pageSize);
        setPage(lastPage);
        refetch();
    };

    const pageRange = Array.from({ length: 5 }, (_, index) => page - 2 + index)
        .filter((pageNumber) => pageNumber > 0 && pageNumber <= Math.ceil((stores?.totalCount || 0) / pageSize));

    const hasStores = stores?.totalCount > 0;
    const lastPage = Math.ceil((stores?.totalCount || 0) / pageSize);

    return (
        <div className="stores-page p-6">
            <div className="mb-6 flex justify-end">
                <Button
                    className="bg-primary-500 hover:bg-primary-600 text-light-1"
                    onClick={() => navigate('/store/create')}
                >
                    Add Store
                </Button>
            </div>

            <div className="filters mt-8">
                <h2 className="h4-bold mb-4">Filters</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Name</FormLabel>
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
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
                        <h3 className="text-lg font-semibold">Stores Found: {stores?.totalCount}</h3>
                    </div>

                    <StoreGrid stores={stores.items} />
                </>
            )}

            <div className="pagination flex items-center gap-2 justify-center mt-8">
                <Button
                    variant="outline"
                    disabled={page === 1 || !hasStores}
                    onClick={handleGoToFirstPage}
                >
                    First
                </Button>
                <Button
                    variant="outline"
                    disabled={page === 1 || !hasStores}
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
                    disabled={page === lastPage || !hasStores}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </Button>
                <Button
                    variant="outline"
                    disabled={page === lastPage || !hasStores}
                    onClick={handleGoToLastPage}
                >
                    Last
                </Button>
            </div>
            
        </div>
    );
};

export default StoresPage;
