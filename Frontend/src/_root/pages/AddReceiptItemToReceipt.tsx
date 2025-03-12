// src/components/AddReceiptItemToReceipt.tsx
import { useNavigate, useParams } from "react-router-dom";
import ReceiptItemForm from "@/components/forms/ReceiptItemForm"; // Formularz dla edycji pozycji paragonu

const AddReceiptItemToReceipt = () => {
  const navigate = useNavigate(); 
  const { id } = useParams(); 



  return (
    <div className="flex flex-col p-4 pt-8 justify-center items-center min-h-screen">
        <div className="max-w-5xl flex-start gap-3 justify-center w-full">
        <ReceiptItemForm
          action="CreateFromReceipt"
          existingReceiptId={id || ''}
        />
      </div>
    </div>
  );
};

export default AddReceiptItemToReceipt;
