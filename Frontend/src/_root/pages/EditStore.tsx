import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetStoreById } from "@/lib/react-query/queriesAndMutations"; // Zapewne masz funkcję, która pobiera dane sklepu
import StoreForm from "@/components/forms/StoreForm"; // Formularz sklepu
import { Button } from "@/components/ui/button";

const EditStore = () => {
  const navigate = useNavigate(); 
  const { id } = useParams(); 
  const { data: store, isLoading } = useGetStoreById(id || '');
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
    if (store) {
      setStoreData(store); 
    }
  }, [store]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }
  
  if (!store) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-red-600">Store Not Found</h1>
          <p className="text-lg text-gray-700 mt-4">
            The store you are looking for does not exist or has been removed.
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
        <StoreForm action="Edit" existingStoreData={store} />
      </div>
    </div>
  );
}

export default EditStore;
