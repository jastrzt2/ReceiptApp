import { INewUser } from "@/types"
import { ProductCategoryMapping, TaxationTypeMapping } from "@/types/contracts/enums";
import { ICreateReceiptRequest, IReceiptFilter, IUpdateReceiptRequest } from "@/types/contracts/receipts/receiptContract";
import { ICreateReceiptItemRequest, IReceiptItemFilter, IUpdateReceiptItemRequest } from "@/types/contracts/receipttems/receiptItemsContract";
import { ICreateStoreRequest, IStoreFilter, IUpdateStoreRequest } from "@/types/contracts/stores/storesContract";

const API_URL = import.meta.env.VITE_API_URL;

async function processErrors(errorData: { errors: { [s: string]: unknown; } | ArrayLike<unknown>; title: any; }) {
	const errorMessage = errorData.errors
		? Object.values(errorData.errors).flat().join(' ')
		: errorData.title || 'Unknown error occurred';
	throw new Error(errorMessage);
}

export async function signInAccount(user: { email: string, password: string }) {
	try {
		const url = `${API_URL}/login?useCookies=true&useSessionCookies=false`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: user.email,
				password: user.password
			}),
			credentials: 'include',
		});
		console.log(response.status)
		if (response.status === 401) {
			throw new Error('Invalid email or password.');
		}

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData)
		}

	} catch (error) {
		console.error('An error occurred during sign in:', error);
		throw error;
	}
}


export async function createUserAccount(user: INewUser) {
	try {
		const response = await fetch(`${API_URL}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		});

		console.log(response)
		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.errors
				? Object.values(errorData.errors).flat().join(' ')
				: errorData.title;
			throw new Error(errorMessage);
		}

		return { success: true };
	} catch (error) {
		console.error('An error occurred while creating the user:', error);
		throw error;
	}
}

export async function signOutAccount() {
	try {
		const response = await fetch(`${API_URL}/api/users/logout`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(`Error logging out: ${errorData}`);
		}

		console.log("Logged out successfully.");
		return { success: true };
	} catch (error) {
		console.error('Failed to log out:', error);
		throw new Error('Failed to log out');
	}
}


export async function getCurrentUser() {
	try {
		const response = await fetch(`${API_URL}/api/users/context`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(`Error fetching current user: ${errorData}`);
		}

		const user = await response.json();
		console.log('Current user:', user);
		return user;
	} catch (error) {
		console.error('Error getting current user:', error);
		throw error;
	}
}



export async function createReceipt(receipt: ICreateReceiptRequest) {
	try {
		console.log(receipt)
		const response = await fetch(`${API_URL}/api/receipts`, {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(receipt), // przesyłamy dane paragonu
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData)
		}

		const createdReceipt = await response.json();
		const receiptId = createdReceipt.id;
		console.log('Receipt ID:', receiptId);

		return receiptId;

	} catch (error) {
		console.error('Error creating receipt:', error);
		throw error;
	}
}

export async function getReceiptById(receiptId: string) {
	try {
		const response = await fetch(`${API_URL}/api/receipts/${receiptId}`, {
			method: 'GET',
			headers: {
				'Accept': '*/*',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData)
		}

		const receipt = await response.json();
		console.log('Fetched receipt:', receipt);
		return receipt;
	} catch (error) {
		console.error('Error fetching receipt:', error);
		throw error;
	}
}

export async function deleteReceiptById(receiptId: string) {
	try {
		const response = await fetch(`${API_URL}/api/receipts/${receiptId}`, {
			method: 'DELETE',
			headers: {
				'Accept': '*/*',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData)
		}

		console.log(`Receipt with ID ${receiptId} has been deleted.`);
		return true;
	} catch (error) {
		console.error('Error deleting receipt:', error);
		throw error;
	}
}

export async function updateReceiptById(receiptId: string, updatedReceiptData: IUpdateReceiptRequest) {
	try {
		const response = await fetch(`${API_URL}/api/receipts/${receiptId}`, {
			method: 'PUT',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(updatedReceiptData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData)
		}

		return response;
	} catch (error) {
		console.error('Error updating receipt:', error);
		throw error;
	}
}

export async function getReceipts(filter: IReceiptFilter, pageNumber = 1, pageSize = 20) {
	try {
		const formatDate = (dateString?: string) => {
			if (!dateString) return undefined;
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				return `${dateString}:00.000Z`;
			}
			return date.toISOString();
		};

		const processedFilter = {
			...filter,
			startIssuedAt: formatDate(filter.startIssuedAt),
			endIssuedAt: formatDate(filter.endIssuedAt)
		};
		const params = new URLSearchParams({
			pageNumber: pageNumber.toString(),
			pageSize: pageSize.toString(),
			...Object.fromEntries(
				Object.entries(processedFilter).filter(([, value]) => value !== undefined && value !== null)
			),
		});

		const response = await fetch(`${API_URL}/api/receipts?${params.toString()}`, {
			method: 'GET',
			headers: {
				'Accept': '*/*',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData)
		}

		const receipts = await response.json();
		console.log('Fetched receipts:', receipts);
		return receipts;
	} catch (error) {
		console.error('Error fetching receipts:', error);
		throw error;
	}
}

export async function createStore(storeData: ICreateStoreRequest) {
	try {
		const response = await fetch(`${API_URL}/api/stores`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(storeData), // dane sklepu
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		const createdStore = await response.json();
		console.log('Store created with ID:', createdStore.id);
		return createdStore.id;
	} catch (error) {
		console.error('Error creating store:', error);
		throw error;
	}
}

export async function updateStore(storeId: string, updatedStoreData: IUpdateStoreRequest) {
	try {
		const response = await fetch(`${API_URL}/api/stores/${storeId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedStoreData),
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		console.log(`Store with ID ${storeId} updated.`);
		return response;
	} catch (error) {
		console.error('Error updating store:', error);
		throw error;
	}
}

export async function deleteStore(storeId: string) {
	try {
		const response = await fetch(`${API_URL}/api/stores/${storeId}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		console.log(`Store with ID ${storeId} has been deleted.`);
		return true;
	} catch (error) {
		console.error('Error deleting store:', error);
		throw error;
	}
}

export async function getStoreById(storeId: string) {
	try {
		const response = await fetch(`${API_URL}/api/stores/${storeId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		const store = await response.json();
		console.log('Fetched store:', store);
		return store;
	} catch (error) {
		console.error('Error fetching store:', error);
		throw error;
	}
}

export async function getUserStores(filter: IStoreFilter, pageNumber = 1, pageSize = 20) {
	try {
		const params = new URLSearchParams({
			pageNumber: pageNumber.toString(),
			pageSize: pageSize.toString(),
			...Object.fromEntries(
				Object.entries(filter).filter(([, value]) => value !== undefined && value !== null)
			),
		});

		const response = await fetch(`${API_URL}/api/stores?${params.toString()}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		const stores = await response.json();
		console.log('Fetched stores:', stores);
		return stores;
	} catch (error) {
		console.error('Error fetching stores:', error);
		throw error;
	}
}

export async function createReceiptItem(receiptItemData: ICreateReceiptItemRequest) {
	try {
		const response = await fetch(`${API_URL}/api/receiptitems`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(receiptItemData),
		});

		if (!response.ok) {
			console.log("SI")
			const errorData = await response.json();
			await processErrors(errorData);
		}

		console.log("SIs2")
		const createdReceiptItem = await response.json();
		console.log("SIs1")
		console.log('Receipt Item created with ID:', createdReceiptItem.id);
		return createdReceiptItem.id;
	} catch (error) {
		console.log(error)
		console.error('Error creating receipt item:', error);
		throw error;
	}
}

export async function updateReceiptItem(id: string, updatedReceiptItemData: IUpdateReceiptItemRequest) {
	try {
		const response = await fetch(`${API_URL}/api/receiptitems/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedReceiptItemData),
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		console.log(`Receipt Item with ID ${id} updated.`);
		return response;
	} catch (error) {
		console.error('Error updating receipt item:', error);
		throw error;
	}
}

export async function deleteReceiptItem(id: string) {
	try {
		const response = await fetch(`${API_URL}/api/receiptitems/${id}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		console.log(`Receipt Item with ID ${id} has been deleted.`);
		return true;
	} catch (error) {
		console.error('Error deleting receipt item:', error);
		throw error;
	}
}

export async function getReceiptItemById(id: string) {
	try {
		const response = await fetch(`${API_URL}/api/receiptitems/${id}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		const receiptItem = await response.json();
		console.log('Fetched receipt item:', receiptItem);
		return receiptItem;
	} catch (error) {
		console.error('Error fetching receipt item:', error);
		throw error;
	}
}

export async function getReceiptItems(filter: IReceiptItemFilter, pageNumber = 1, pageSize = 20) {
	try {
		const transformedFilter: Record<string, any> = { ...filter };

        if (filter.productCategory !== undefined && filter.productCategory !== null) {
            transformedFilter.productCategory = ProductCategoryMapping[filter.productCategory];
        }

        if (filter.taxationType !== undefined && filter.taxationType !== null) {
            transformedFilter.taxationType = TaxationTypeMapping[filter.taxationType];
        }

		const params = new URLSearchParams({
			pageNumber: pageNumber.toString(),
			pageSize: pageSize.toString(),
			...Object.fromEntries(
				Object.entries(transformedFilter).filter(([, value]) => value !== undefined && value !== null)
			),
		});

		console.log(params)
		const response = await fetch(`${API_URL}/api/receiptitems?${params.toString()}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
			credentials: 'include',
		});

		if (!response.ok) {
			const errorData = await response.json();
			await processErrors(errorData);
		}

		const receiptItems = await response.json();
		console.log('Fetched receipt items:', receiptItems);
		return receiptItems;
	} catch (error) {
		console.error('Error fetching receipt items:', error);
		throw error;
	}
}



export async function getAnnualStatistics(year: number) {
    try {
        const response = await fetch(`${API_URL}/api/statistics/annual/${year}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            await processErrors(errorData);
        }

        const annualStatistics = await response.json();
        console.log('Fetched annual statistics:', annualStatistics);
        return annualStatistics;
    } catch (error) {
        console.error('Error fetching annual statistics:', error);
        throw error;
    }
}

export async function getMonthlyCategoryStatistics(year: number, month: number) {
    try {
        const response = await fetch(`${API_URL}/api/statistics/monthly/category/${year}/${month}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            await processErrors(errorData);
        }

        const monthlyCategoryStatistics = await response.json();
        console.log('Fetched monthly category statistics:', monthlyCategoryStatistics);
        return monthlyCategoryStatistics;
    } catch (error) {
        console.error('Error fetching monthly category statistics:', error);
        throw error;
    }
}

export async function getMonthlyDailyStatistics(year: number, month: number) {
    try {
        const response = await fetch(`${API_URL}/api/statistics/monthly/daily/${year}/${month}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            await processErrors(errorData);
        }

        const monthlyDailyStatistics = await response.json();
        console.log('Fetched monthly daily statistics:', monthlyDailyStatistics);
        return monthlyDailyStatistics;
    } catch (error) {
        console.error('Error fetching monthly daily statistics:', error);
        throw error;
    }
}
