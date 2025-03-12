import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ReceiptValidation } from '@/lib/validation/validation';
import { useCreateReceipt, useUpdateReceipt } from '@/lib/react-query/queriesAndMutations';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { ICreateReceiptRequest } from '@/types/contracts/receipts/receiptContract';
import { useNavigate, useParams } from 'react-router-dom';

interface ReceiptFormProps {
    action: 'Create' | 'Edit';
    existingReceiptData?: ICreateReceiptRequest;
}

const ReceiptForm = ({ action, existingReceiptData }: ReceiptFormProps) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formErrors, setFormErrors] = useState<string[]>([]);


    const defaultValues = action === 'Edit' && existingReceiptData
        ? {
            storeId: existingReceiptData.storeId || undefined,
            totalPLN: existingReceiptData.totalPLN ?? 0, 
            totalTax: existingReceiptData.totalTax ?? 0,
            change: existingReceiptData.change ?? 0,
            paymentType: existingReceiptData.paymentType || '',
            comment: existingReceiptData.comment || '',
            issuedAt: existingReceiptData.issuedAt
                ? new Date(existingReceiptData.issuedAt).toISOString().slice(0, 16) 
                : '',
        }
        : {
            storeId: undefined,
            totalPLN: 0,
            totalTax: 0, 
            paymentType: '',
            change: 0,  
            comment: undefined,
            issuedAt: '',
        };

    const form = useForm<z.infer<typeof ReceiptValidation>>({
        resolver: zodResolver(ReceiptValidation),
        defaultValues,
    });




    const { handleSubmit } = form;

    const { mutateAsync: createReceipt, isPending: isCreatingReceipt } = useCreateReceipt();
    const { mutateAsync: updateReceipt, isPending: isUpdatingReceipt } = useUpdateReceipt();

    const onSubmit = async (data: z.infer<typeof ReceiptValidation>) => {
        const receiptData = {
            storeId: data.storeId === 'null' ? undefined : data.storeId, 
            totalPLN: parseFloat(data.totalPLN.toString()), 
            totalTax: parseFloat(data.totalTax.toString()),
            paymentType: data.paymentType,
            change: data.change !== undefined ? parseFloat(data.change.toString()) : undefined,
            comment: data.comment,
            issuedAt: data.issuedAt,
        };

        try {
            setFormErrors([]);
            if (action === 'Create') {
                const receiptId = await createReceipt(receiptData as ICreateReceiptRequest);
                navigate(`/receipt/${receiptId}`);
            } else if (action === 'Edit' && id) {
                await updateReceipt({ receiptId: id, updatedReceiptData: receiptData });
                navigate(`/receipt/${id}`);
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
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">{action} Receipt</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                        <FormField
                            control={form.control}
                            name="storeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store ID</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalPLN"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total PLN</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="shad-input text-black"
                                            {...field}
                                            value={field.value || ''} 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalTax"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Tax</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="shad-input text-black"
                                            {...field}
                                            value={field.value || ''} 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="change"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Change</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="shad-input text-black"
                                            {...field}
                                            value={field.value || ''} 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red" />
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
                                        <Input type="text" className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comment</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="issuedAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issued At</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            className="shad-input text-black"
                                            {...field}
                                            value={field.value || ''} 
                                        />
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
                            {isCreatingReceipt || isUpdatingReceipt ? (
                                <div className="flex-center gap-2">
                                    <Loader />
                                </div>
                            ) : (
                                `${action} Receipt`
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </Form>
    );
};

export default ReceiptForm;
