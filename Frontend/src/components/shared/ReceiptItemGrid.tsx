
import { IReceiptItemResponse } from '@/types/contracts/receipttems/receiptItemsContract';
import { Link } from 'react-router-dom';
import { TaxationTypeReverseMapping, ProductCategoryReverseMapping } from '@/types/contracts/enums';

type ReceiptItemGridProps = {
    receiptItems: IReceiptItemResponse[];
};

const ReceiptItemGrid = ({ receiptItems }: ReceiptItemGridProps) => {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {receiptItems.map((item) => (
                <li
                    key={item.receiptItemId}
                    className="relative w-full border border-gray-300 rounded-md shadow-sm p-4"
                >
                    <Link to={`/receiptItem/${item.receiptItemId}`} className="grid-receipt_item_link">
                        <div className="grid-receipt_item_content">
                            <p><strong>Name:</strong> {item.productName}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Price:</strong> {item.productPrice} PLN</p>
                            <p><strong>Amount:</strong> {item.quantity * item.productPrice}</p>
                            <p>
                                <strong>Tax Type:</strong> {TaxationTypeReverseMapping[item.taxationType as unknown as number] || "Nieznany typ podatku"}
                            </p>
                            <p>
                                <strong>Category:</strong> {ProductCategoryReverseMapping[item.taxationType as unknown as number] || "Nieznana kategoria produktu"}
                            </p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ReceiptItemGrid;
