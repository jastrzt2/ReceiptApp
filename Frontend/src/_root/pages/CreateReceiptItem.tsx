import { useNavigate, useParams } from "react-router-dom";
import ReceiptItemForm from "@/components/forms/ReceiptItemForm";

const CreateReceiptItem = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  return (
    <div className="flex flex-col p-4 pt-8 justify-center items-center min-h-screen">
      <div className="max-w-5xl gap-3 justify-center w-full">
        <ReceiptItemForm
          action="Create"
        />
      </div>
    </div>
  );
};

export default CreateReceiptItem;
