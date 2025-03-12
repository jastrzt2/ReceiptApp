// src/components/ReceiptItemForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateReceiptItem, useUpdateReceiptItem } from '@/lib/react-query/queriesAndMutations';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { ICreateReceiptItemRequest } from '@/types/contracts/receipttems/receiptItemsContract';
import { ReceiptItemValidation } from '@/lib/validation/validation';
import { TaxationType, ProductCategory, getProductCategoryString, getTaxationTypeString } from '@/types/contracts/enums';
import { TaxationTypeMapping, ProductCategoryMapping } from '@/types/contracts/enums';

interface ReceiptItemFormProps {
  action: 'Create' | 'Edit' | 'CreateFromReceipt';
  existingItemData?: ICreateReceiptItemRequest;
  existingReceiptId?: string;
}

const ReceiptItemForm = ({ action, existingItemData, existingReceiptId }: ReceiptItemFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState<string[]>([]);


  const defaultValues: z.infer<typeof ReceiptItemValidation> = 
  action === 'Edit' && existingItemData
    ? {
      receiptId: existingItemData.receiptId || '',
      productName: existingItemData.productName || '',
      quantity: existingItemData.quantity ?? 1,
      productPrice: existingItemData.productPrice ?? 0,
      taxationType: getTaxationTypeString(existingItemData.taxationType) || undefined,
      productCategory: getProductCategoryString(existingItemData.productCategory) || undefined,
    }
    : action === 'CreateFromReceipt' && existingReceiptId
      ? {
          receiptId: existingReceiptId || '',
          productName: '',
          quantity: 1,
          productPrice: 0,
          taxationType: undefined, 
          productCategory: undefined, 
        }
      : {
          receiptId: '',
          productName: '',
          quantity: 1,
          productPrice: 0,
          taxationType: undefined, 
          productCategory: undefined, 
        };


  const form = useForm<z.infer<typeof ReceiptItemValidation>>({
    resolver: zodResolver(ReceiptItemValidation),
    defaultValues,
  });

  const { handleSubmit } = form;

  const { mutateAsync: createReceiptItem, isPending: isCreatingReceiptItem } = useCreateReceiptItem();
  const { mutateAsync: updateReceiptItem, isPending: isUpdatingReceiptItem } = useUpdateReceiptItem();

  const onSubmit = async (data: z.infer<typeof ReceiptItemValidation>) => {

    const convertedTaxationType = TaxationTypeMapping[data.taxationType as TaxationType];
    const convertedProductCategory = ProductCategoryMapping[data.productCategory as ProductCategory];

    const receiptItemData: ICreateReceiptItemRequest = {
      receiptId: data.receiptId,
      productName: data.productName,
      quantity: data.quantity,
      productPrice: parseFloat(data.productPrice.toString()),
      taxationType: convertedTaxationType,
      productCategory: convertedProductCategory,
    };

    try {
      setFormErrors([]);
      if (action === 'Create' || action === 'CreateFromReceipt') {
        const receiptItemId = await createReceiptItem(receiptItemData);
        navigate(`/receiptitem/${receiptItemId}`);
      } else if (action === 'Edit' && id) {
        await updateReceiptItem({ id: id, updatedReceiptItemData: receiptItemData });
        navigate(`/receiptitem/${id}`);
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
    <Form {...form} >
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md justify-center flex flex-col items-center">
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">{action === 'CreateFromReceipt' ? 'Create' : action} Receipt Item</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
            <div className="flex flex-col gap-5 w-full mt-4">

              {/* ReceiptId Field */}
              <FormField
                control={form.control}
                name="receiptId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt ID</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input text-black"
                        {...field}
                        disabled={action === 'Edit'} // Opcjonalnie: zablokuj edycję ReceiptId podczas edycji
                      />
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              {/* Product Name Field */}
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input text-black" {...field} />
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              {/* Quantity Field */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="shad-input text-black"
                        {...field}
                        min={1}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              {/* Product Price Field */}
              <FormField
                control={form.control}
                name="productPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="shad-input text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              {/* Taxation Type Field */}
              <FormField
                control={form.control}
                name="taxationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxation Type  </FormLabel>
                    <FormControl>
                      <select
                        className="shad-input text-black"
                        {...field}
                        value={field.value || ''}
                      >
                        <option value="">Select Taxation Type  </option>
                        {Object.values(TaxationType).map((taxType) => (
                          <option key={taxType} value={taxType}>
                            {taxType}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              {/* Product Category Field */}
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category  </FormLabel>
                    <FormControl>
                      <select
                        className="shad-input text-black"
                        {...field}
                        value={field.value || ''}
                      >
                        <option value="">Select Product Category  </option>
                        {Object.values(ProductCategory).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              {/* Formularz Błędu */}
              {formErrors.length > 0 && (
                <div className="text-rose-700 text-sm mb-4">
                  {formErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              {/* Przycisk Submit */}
              <Button type="submit" className="bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2">
                {isCreatingReceiptItem || isUpdatingReceiptItem ? (
                  <div className="flex-center gap-2">
                    <Loader />
                  </div>
                ) : (
                  `${action} Item`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Form>
  );
}
export default ReceiptItemForm;
