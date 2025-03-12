import { IStoreResponse } from '@/types/contracts/stores/storesContract';
import { Link } from 'react-router-dom';

type StoreGridProps = {
    stores: IStoreResponse[];
};

const StoreGrid = ({ stores }: StoreGridProps) => {
    return (
        <ul className="mt-4 space-y-4">
            {stores.length > 0 ? (
                stores.map((store: IStoreResponse) => (
                    <li
                        key={store.storeId}
                        className="border p-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Link to={`/store/${store.storeId}`}>
                        <h3 className="font-bold">Id: {store.storeId}</h3>
                            <h3>Name: {store.name}</h3>
                            <p>Address: {store.address}</p>
                        </Link>
                    </li>
                ))
            ) : (
                <p>No stores found</p>
            )}
        </ul>
    );
};

export default StoreGrid;
