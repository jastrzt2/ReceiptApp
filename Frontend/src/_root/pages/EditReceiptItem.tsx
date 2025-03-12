import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetReceiptItemById, useUpdateReceiptItem } from "@/lib/react-query/queriesAndMutations"; 
import ReceiptItemForm from "@/components/forms/ReceiptItemForm"; // Formularz dla edycji pozycji paragonu
import { Button } from "@/components/ui/button";

const EditReceiptItem = () => {
  const navigate = useNavigate(); 
  const { id } = useParams(); 
  const { data: receiptItem, isLoading: isLoadingReceiptItem, isError: isErrorReceiptItem } = useGetReceiptItemById(id || ''); 
  const [receiptItemData, setReceiptItemData] = useState(null); 

  useEffect(() => {
    if (receiptItem) {
      setReceiptItemData(receiptItem);
    }
  }, [receiptItem]);

  if (isLoadingReceiptItem) {
    return <div>Loading...</div>;
  }

  if (isErrorReceiptItem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-red-600">Receipt Item Not Found</h1>
          <p className="text-lg text-gray-700 mt-4">
            The receipt item you are trying to edit does not exist or has been removed.
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

  return (
    <div className="flex flex-col p-4 pt-8 justify-center items-center min-h-screen">
      <div className="max-w-5xl flex-start gap-3 justify-center w-full">
        <ReceiptItemForm
          action="Edit"
          existingItemData={receiptItem}
        />
      </div>
    </div>
  );
};

export default EditReceiptItem;
