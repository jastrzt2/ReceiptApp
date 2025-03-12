import { Route, Routes } from 'react-router-dom';
import SignInForm from './_auth/Forms/SignInForm.tsx';
import SignUpForm from './_auth/Forms/SignUpFrom.tsx';
import './index.css';
import Home from './_root/pages/Home.tsx';
import CreateReceipt from './_root/pages/CreateReceipt.tsx';
import ReceiptDetails from './_root/pages/ReceiptDetails.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import AuthLayout from './_auth/AuthLayout.tsx';
import RootLayout from './_root/RootLayout.tsx';
import ReceiptPage from './_root/pages/Receipts.tsx';
import StoresPage from './_root/pages/Stores.tsx';
import StoreDetails from './_root/pages/StoreDetails.tsx';
import CreateStore from './_root/pages/CreateStore.tsx';
import EditStore from './_root/pages/EditStore.tsx';
import EditReceipt from './_root/pages/EditReceipt.tsx';
import ReceiptItemsPage from './_root/pages/ReceiptItems.tsx';
import ReceiptItemDetails from './_root/pages/ReceiptItemDetails.tsx';
import EditReceiptItem from './_root/pages/EditReceiptItem.tsx';
import CreateReceiptItem from './_root/pages/CreateReceiptItem.tsx';
import AddReceiptItemToReceipt from './_root/pages/AddReceiptItemToReceipt.tsx';

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>

        {/* Private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/receipt" element={<ReceiptPage />} />
          <Route path="/receipt/create" element={<CreateReceipt />} />
          <Route path="/receipt/:id" element={<ReceiptDetails />} />
          <Route path="/receipt/:id/add-item" element={<AddReceiptItemToReceipt/>} />
          <Route path="/receipt/edit/:id" element={<EditReceipt />} />
          <Route path="/store" element={<StoresPage />} />
          <Route path="/store/:id" element={<StoreDetails />} />
          <Route path="/store/edit/:id" element={<EditStore />} />
          <Route path="/store/create" element={<CreateStore />} />
          <Route path="/receiptItem" element={<ReceiptItemsPage />} />
          <Route path="/receiptItem/:id" element={<ReceiptItemDetails />} />
          <Route path="/receiptItem/edit/:id" element={<EditReceiptItem />} />
          <Route path="/receiptItem/create" element={<CreateReceiptItem />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};


export default App
