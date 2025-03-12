import { Button } from '@/components/ui/button';
import { useDeleteStore, useGetStoreById } from '@/lib/react-query/queriesAndMutations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/shared/Loader';

const StoreDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Details of store:", id);

  // Fetch store details
  const { data: store, isLoading } = useGetStoreById(id || '');
  const { mutate: deleteStore } = useDeleteStore();

  const handleDeleteStore = () => {
    deleteStore(id || '');
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
    <div className="store_details-container flex justify-center items-center min-h-screen">
      <div className="text-center bg-white shadow-lg p-8 rounded-md text-black">
        <p className="base-medium lg:body-bold">
          <strong>Store ID:</strong> {store.storeId}
        </p>

        <p className="subtle-semibold lg:small-regular ">
          <strong>Store Name:</strong> {store.name}
        </p>

        <p className="subtle-semibold lg:small-regular ">
          <strong>Address:</strong> {store.address}
        </p>

        <hr className="border w-full border-dark-4/80 my-4" />
        <div className="button-group">
          <Button
            onClick={handleDeleteStore}
            variant="ghost"
            className="ghost_details-delete_btn"
            style={{ display: "inline-block", marginRight: "10px" }}
          >
            <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
          </Button>
          <Link
            className="ghost_details-edit_btn"
            to={`/store/edit/${id}`}
            style={{ display: "inline-block" }}
          >
            <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default StoreDetails;
