import StoreForm from "@/components/forms/StoreForm"; // Import formularza sklepu

const CreateStore = () => {
  return (
    <div className="flex flex-col p-4 pt-8 justify-center items-center min-h-screen">
      <div className="max-w-5xl flex-start gap-3 justify-center w-full">
        <StoreForm action="Create" /> 
      </div>
    </div>
  );
};

export default CreateStore;
