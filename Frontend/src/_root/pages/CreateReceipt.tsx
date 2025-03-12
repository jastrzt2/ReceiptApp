import CreateReceiptForm from "@/components/forms/ReciptForm"

const CreateReceipt = () => {
  return (
    <div className="flex flex-col p-4 pt-8 justify-center items-center min-h-screen">
        <div className="max-w-5xl flex-start gap-3 justify-center w-full">
        <CreateReceiptForm action={'Create'} />
      </div>
    </div>
  )
}

export default CreateReceipt