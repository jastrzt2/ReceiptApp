// src/components/ReceiptItemDetails.tsx
import { Button } from '@/components/ui/button';
import { useDeleteReceiptItem, useGetReceiptItemById } from '@/lib/react-query/queriesAndMutations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import { getProductCategoryString, getTaxationTypeString, ProductCategory, TaxationType } from '@/types/contracts/enums';
import { timeAgo } from '@/lib/utils';

const ReceiptItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: receiptItem, isLoading, isError } = useGetReceiptItemById(id || '');
  const { mutate: deleteReceiptItem } = useDeleteReceiptItem();

  const handleDeleteReceiptItem = () => {
    if (window.confirm("Are you sure you want to delete this receipt item?")) {
      deleteReceiptItem(id || '', {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error: any) => {
          console.error("Failed to delete receipt item:", error);
          alert("Failed to delete the receipt item. Please try again.");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError || !receiptItem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-red-600">Receipt Item Not Found</h1>
          <p className="text-lg text-gray-700 mt-4">
            The receipt item you are looking for does not exist or has been removed.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-6"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  console.log("Details of receipt item:", receiptItem);
  const taxationTypeEnum = getTaxationTypeString(receiptItem.taxationType) || undefined;
  const productCategoryEnum = getProductCategoryString(receiptItem.productCategory)|| undefined;

  const getCategoryLabel = (category?: ProductCategory) => {
    if (!category) return "N/A";
    return category.replace(/([A-Z])/g, ' $1'); 
  };

  const getTaxationLabel = (taxation?: TaxationType) => {
    if (!taxation) return "N/A";
    return taxation.toUpperCase();
  };

  return (
    <div className="receipt_item_details-container flex justify-center items-center min-h-screen p-6">
      <div className="text-center bg-white shadow-lg p-8 rounded-md text-black w-full max-w-md">
        <p className="base-medium lg:body-bold text-black">
          <strong>Receipt ID:</strong> {receiptItem.receiptId}
        </p>
        <p className="base-medium lg:body-bold text-black">
          <strong>Receipt Item ID:</strong> {receiptItem.receiptItemId}
        </p>

        <p className="subtle-semibold lg:small-regular mt-4">
          <strong>Product Name:</strong> {receiptItem.productName}
        </p>

        <p className="subtle-semibold lg:small-regular mt-2">
          <strong>Quantity:</strong> {receiptItem.quantity}
        </p>

        <p className="subtle-semibold lg:small-regular mt-2">
          <strong>Price:</strong> {receiptItem.productPrice.toFixed(2)} PLN
        </p>

        <p className="subtle-semibold lg:small-regular mt-2">
          <strong>Taxation Type:</strong> {getTaxationLabel(taxationTypeEnum)}
        </p>

        <p className="subtle-semibold lg:small-regular mt-2">
          <strong>Category:</strong> {getCategoryLabel(productCategoryEnum)}
        </p>

        <hr className="border w-full border-dark-4/80 my-4" />
        <div className="button-group">
          <Button
            onClick={handleDeleteReceiptItem}
            variant="ghost"
            className="ghost_details-delete_btn"
            style={{ display: "inline-block", marginRight: "10px" }}
          >
            <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
          </Button>
          <Link
            className="ghost_details-edit_btn"
            to={`/receiptItem/edit/${id}`}
            style={{ display: "inline-block" }}
          >
            <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReceiptItemDetails;
