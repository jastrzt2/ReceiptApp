import { IReceiptResponse } from '@/types/contracts/receipts/receiptContract';
import { Link } from 'react-router-dom';


type ReceiptGridProps = {
    receipts: IReceiptResponse[];
};

const ReceiptGrid = ({ receipts }: ReceiptGridProps) => {
    return (
        <ul className="grid-container">
            {receipts.map((receipt) => (
                <li key={receipt.receiptId} className="relative min-w-80 h-80 border border-gray-300 rounded-md shadow-sm p-4">
                    <Link to={`/receipts/${receipt.receiptId}`} className="grid-receipt_link">
                        <div className="grid-receipt_content">
                            <p><strong>Total:</strong> {receipt.totalPLN} PLN</p>
                            <p><strong>Tax:</strong> {receipt.totalTax} PLN</p>
                            <p><strong>Issued At:</strong> {new Date(receipt.issuedAt).toLocaleString()}</p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ReceiptGrid;
