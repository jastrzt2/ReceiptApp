import Loader from '@/components/shared/Loader';
import ReceiptItemGrid from '@/components/shared/ReceiptItemGrid';
import { Button } from '@/components/ui/button';
import { useDeleteReceiptById, useGetReceiptById, useGetReceiptItems } from '@/lib/react-query/queriesAndMutations';
import { timeAgo } from '@/lib/utils';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ReceiptDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Details of receipt:", id);
  const { data: receipt, isLoading } = useGetReceiptById(id || '');
  const { mutate: deleteReceipt } = useDeleteReceiptById();

  const handleDeleteReceipt = () => {
    deleteReceipt(id || '');
    navigate(-1);
  };

  const { data: receiptItems, isLoading: isLoadingItems, isError } = useGetReceiptItems(
    { receiptId: id || '' },
    1,                     
    100                    
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-red-600">Receipt Not Found</h1>
          <p className="text-lg text-gray-700 mt-4">
            The receipt you are looking for does not exist or has been removed.
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

  const formattedDate = new Date(receipt.issuedAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = new Date(receipt.issuedAt).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="receipt_details-container flex flex-col p-4 pt-8 justify-center items-center min-h-screen">
      <div className="text-center bg-white shadow-lg p-8 rounded-md text-black">
        <p className="base-medium lg:body-bold ">
          <strong>Receipt ID:</strong> {receipt.receiptId}
        </p>

        <p className="subtle-semibold lg:small-regular ">
          <strong>Issued:</strong> {timeAgo(receipt.issuedAt)} - {formattedDate}, {formattedTime}
        </p>
        <p className="subtle-semibold lg:small-regular ">
          <strong>Payment Type:</strong> {receipt.paymentType}
        </p>
        <p className="small-medium lg:base-medium">
          <strong>Total (PLN):</strong> {receipt.totalPLN.toFixed(2)} PLN
        </p>
        <p className="small-medium lg:base-medium">
          <strong>Total Tax:</strong> {receipt.totalTax.toFixed(2)} PLN
        </p>
        <p className="small-medium lg:base-medium">
          <strong>Change:</strong> {receipt.change.toFixed(2)} PLN
        </p>
        {receipt.comment && (
          <p className="small-medium lg:base-medium">
            <strong>Comment:</strong> {receipt.comment}
          </p>
        )}

        <hr className="border w-full border-dark-4/80 my-4" />
        {receipt.storeId && (
          <Link
          to={`/store/${receipt.storeId}`}>
          <p className="subtle-semibold lg:small-regular ">
            <strong>Store ID:</strong> {receipt.storeId}
          </p> 
          </Link>
        )}
        <div className="button-group">
          <Button
            onClick={handleDeleteReceipt}
            variant="ghost"
            className="ghost_details-delete_btn"
            style={{ display: "inline-block", marginRight: "10px" }}
          >
            <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
          </Button>
          <Link
            className="ghost_details-edit_btn"
            to={`/receipt/edit/${id}`}
            style={{ display: "inline-block" }}
          >
            <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
          </Link>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => navigate(`/receipt/${id}/add-item`)}
            className="bg-primary-500 hover:bg-primary-600 text-light-1"
          >
            Add Receipt Item
          </Button>
        </div>
      </div>
      {isLoadingItems ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error fetching data</div>
      ) : (
        <>
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Related Receipt Items: {receiptItems?.totalCount}</h3>
          </div>

          <ReceiptItemGrid receiptItems={receiptItems.items} />
        </>
      )}
    </div>
  );
};

export default ReceiptDetails;
