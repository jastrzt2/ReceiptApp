import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StoreValidation } from '@/lib/validation/validation'; // Zakładając, że masz już odpowiednią walidację
import { useCreateStore, useUpdateStore } from '@/lib/react-query/queriesAndMutations';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { ICreateStoreRequest } from '@/types/contracts/stores/storesContract';

interface StoreFormProps {
    action: 'Create' | 'Edit';
    existingStoreData?: ICreateStoreRequest;
}

const StoreForm = ({ action, existingStoreData }: StoreFormProps) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const defaultValues = action === 'Edit' && existingStoreData
        ? {
            name: existingStoreData.name || '',
            address: existingStoreData.address || '',
        }
        : {
            name: '',
            address: '',
        };

    const form = useForm<z.infer<typeof StoreValidation>>({
        resolver: zodResolver(StoreValidation),
        defaultValues,
    });

    const { handleSubmit } = form;

    const { mutateAsync: createStore, isPending: isCreatingStore } = useCreateStore();
    const { mutateAsync: updateStore, isPending: isUpdatingStore } = useUpdateStore();

    const onSubmit = async (data: z.infer<typeof StoreValidation>) => {
        const storeData: ICreateStoreRequest = {
            name: data.name,
            address: data.address
        };

        try {
            setFormErrors([]);
            if (action === 'Create') {
                const storeId = await createStore(storeData);
                navigate(`/store/${storeId}`);
            } else if (action === 'Edit' && id) {
                await updateStore({ storeId: id, updatedStoreData: storeData });
                navigate(`/store/${id}`);
            }
        } catch (error) {
            console.error('Error:', error);
            const newErrors: string[] = [];
            if (error instanceof Error) {
                newErrors.push(error.message);
            }
            setFormErrors(newErrors);
        }
    };

    return (
        <Form {...form}>
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md flex flex-col items-center">
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">{action} Store</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red" />
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
                                        <Input type="text" className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />

                        {formErrors.length > 0 && (
                            <div className="text-rose-700 text-sm mb-4">
                                {formErrors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}
                        <Button type="submit" className="bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2">
                            {isCreatingStore || isUpdatingStore ? (
                                <div className="flex-center gap-2">
                                    <Loader />
                                </div>
                            ) : (
                                `${action} Store`
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </Form>
    );
};

export default StoreForm;
