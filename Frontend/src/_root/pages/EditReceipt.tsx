import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetReceiptById } from "@/lib/react-query/queriesAndMutations";
import CreateReceiptForm from "@/components/forms/ReciptForm";
import { Button } from "@/components/ui/button";

const EditReceipt = () => {
  const navigate = useNavigate(); 
  const { id } = useParams(); 
  const { data: receipt, isLoading } = useGetReceiptById(id || ''); 
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (receipt) {
      setReceiptData(receipt);
    }
  }, [receipt]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }
  if (!receipt) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
  return (
    <div className="flex flex-col p-4 pt-8 justify-center items-center min-h-screen">
      <div className="max-w-5xl flex-start gap-3 justify-center w-full">
        <CreateReceiptForm action="Edit" existingReceiptData={receipt} />
      </div>
    </div>
  );
}

export default EditReceipt;