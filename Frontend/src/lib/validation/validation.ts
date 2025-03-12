import { ProductCategory, TaxationType } from "@/types/contracts/enums";
import { z } from "zod"


export const SignUpValidation = z.object({
  email: z.string().email('Invalid email address.').min(1, 'Email address is required.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .regex(/\d/, 'Password must contain at least one digit.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/\W/, 'Password must contain at least one non-alphanumeric character.')
});


export const SignInValidation = z.object({
  email: z.string().email('Invalid email address.').min(1, 'Email address is required.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .regex(/\d/, 'Password must contain at least one digit.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/\W/, 'Password must contain at least one non-alphanumeric character.')
});


const MAX_PAYMENT_TYPE_LENGTH = 100;
const MAX_COMMENT_LENGTH = 500;

export const ReceiptValidation = z
  .object({
    storeId: z.string().optional(),

    totalPLN: z.preprocess((val) => parseFloat(val as string),
      z.number()
        .positive()
        .refine((val) => val > 0, {
          message: "Total PLN must be greater than 0",
        })
        .refine((val) => Math.round(val * 100) === val * 100, {
          message: "Total PLN cannot have more than two decimal places",
        })
    ),

    totalTax: z.preprocess((val) => parseFloat(val as string),
      z.number()
        .nonnegative()
        .refine((val) => val >= 0, {
          message: "Total Tax cannot be negative",
        })
        .refine((val) => Math.round(val * 100) === val * 100, {
          message: "Total Tax cannot have more than two decimal places",
        })
    ),

    paymentType: z
      .string()
      .min(1, { message: "Payment type is required" })
      .max(MAX_PAYMENT_TYPE_LENGTH, { message: `Payment type can't exceed ${MAX_PAYMENT_TYPE_LENGTH} characters` }),

    change: z.preprocess(
      (val) => (val !== '' ? parseFloat(val as string) : undefined),
      z.number()
        .optional()
        .refine((val) => val === undefined || val >= 0, {
          message: "Change cannot be negative",
        })
        .refine((val) => val === undefined || Math.round(val * 100) === val * 100, {
          message: "Change cannot have more than two decimal places",
        })
    ),

    comment: z
      .string()
      .max(MAX_COMMENT_LENGTH, { message: `Comment can't exceed ${MAX_COMMENT_LENGTH} characters` })
      .optional(),

    issuedAt: z
      .string()
      .refine((value) => {
        const issuedAtDate = new Date(value);
        return !isNaN(issuedAtDate.getTime()) && issuedAtDate <= new Date();
      }, { message: "Issued date cannot be in the future" })
      .transform((value) => new Date(value).toISOString()),
  })
  .refine(
    (data) => data.totalTax <= data.totalPLN,
    {
      message: "Total Tax cannot be greater than Total PLN",
      path: ["totalTax"],
    }
  );



const MAX_STORE_NAME_LENGTH = 500;
const MAX_STORE_ADDRESS_LENGTH = 500;

export const StoreValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Store name is required." })
    .max(MAX_STORE_NAME_LENGTH, { message: `Store name can't be longer than ${MAX_STORE_NAME_LENGTH} characters.` }),

  address: z
    .string()
    .min(1, { message: "Store address is required." })
    .max(MAX_STORE_ADDRESS_LENGTH, { message: `Store address can't be longer than ${MAX_STORE_ADDRESS_LENGTH} characters.` }),
})
  .refine((data) => data.name.trim() !== '', {
    message: "Store name cannot be empty.",
    path: ["name"],
  })
  .refine((data) => data.address.trim() !== '', {
    message: "Store address cannot be empty.",
    path: ["address"],
  });


const MAX_PRODUCT_NAME_LENGTH = 100;

export const ReceiptItemValidation = z
  .object({
    receiptId: z
      .string()
      .min(1, { message: "Receipt ID is required" })
      .max(100, { message: "Receipt ID can't exceed 100 characters" }),

    productName: z
      .string()
      .min(1, { message: "Product name is required" })
      .max(MAX_PRODUCT_NAME_LENGTH, {
        message: `Product name can't exceed ${MAX_PRODUCT_NAME_LENGTH} characters`,
      }),

    quantity: z
      .preprocess((val) => parseFloat(val as string),
        z.number()
          .positive({ message: "Quantity price must be greater than 0" })

      ),
    productPrice: z
      .preprocess((val) => parseFloat(val as string),
        z.number()
          .positive({ message: "Product price must be greater than 0" })
          .refine((val) => Math.round(val * 100) === val * 100, {
            message: "Product price cannot have more than two decimal places",
          })
      ),
      taxationType: z.preprocess((val) => (val === '' ? undefined : val), z.nativeEnum(TaxationType).optional()),

      productCategory: z.preprocess((val) => (val === '' ? undefined : val), z.nativeEnum(ProductCategory).optional()),
  
  })
  .refine(
      (data) => data.taxationType !== undefined,
      {
          message: "Taxation Type is required",
          path: ["taxationType"],
      }
  )
  .refine(
      (data) => data.productCategory !== undefined,
      {
          message: "Product Category is required",
          path: ["productCategory"],
      }
  );