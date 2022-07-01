export const API_BASE_URL = "https://api-goatz-marketplace.herokuapp.com/api/";
export const API_SHEET_BASE_URL = "https://v1.nocodeapi.com/maisondegoat/google_sheets/";
export const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjkxMWJjYzIwYjIwNzJiNTNhZjVlNTUiLCJ3YWxsZXRJZCI6IjEyMzQ5amZvaXdlcjIzOXJpM3JmcjIzbzJybjNvMnAiLCJpYXQiOjE2NTM2NzcwMDR9.ryMQEMMC84mDd0h-6bbwn3knX5DzC32tVAIvKmNsjNI";

export const filterObj = [
    { view: 'latest first', filter: 'latestFirst' },
    { view: 'price high-low', filter: 'priceHighLow' },
    { view: 'price low-high', filter: 'priceLowHigh' }
]

// USER
export const registerUser = async (dataToSend: any) => {
    const res = await fetch(`${API_BASE_URL}user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
}

// admin/getAllProduct?page=1&limit=24&sort=gMilkPrice&sortBy=-1
export const fetchAllProductAdmin = async (sort: string, sortBy: number, walletAddress: string) => {
    const res = await fetch(`${API_BASE_URL}admin/getAllProduct?page=1&limit=24&sort=${sort}&sortBy=${sortBy}`, {
        headers: {
            walletId: walletAddress
        }
    });
    const data = await res.json();
    if (data.status !== 200) {
        return {
            status: false,
            data: data.message
        }
    } else {
        return {
            status: true,
            data: data.data[0]?.totalCount.totalRecords > 0 ? data.data[0].data : []
        }
    }
}

// PRODUCT
export const fetchAllProduct = async (sort: string, sortBy: number) => {
    const res = await fetch(`${API_BASE_URL}product/getAllProduct?sort=${sort}&sortBy=${sortBy}`);
    const data = await res.json();
    if (data.status !== 200) {
        return {
            status: false,
            data: data.message
        }
    } else {
        return {
            status: true,
            data: data.data[0]?.totalCount.totalRecords > 0 ? data.data[0].data : []
        }
    }
}

export const fetchProductById = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}product/getProduct/${id}`);
    const data = await res.json();
    if (data.status !== 200) {
        return {
            status: false,
            data: data.message
        }
    } else {
        return {
            status: true,
            data: data
        }
    }
}

export const uploadImageOnAddProduct = async (formdata: any) => {
    const res = await fetch(`${API_BASE_URL}user/uploadImage`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${AUTH_TOKEN}`
        },
        body: formdata
    });
    const data = await res.json();

    if (data.status !== 200) {
        return { status: false, data: data.message }
    } else {
        return { status: true, data: data }
    }
}

export const addProduct = async (dataToSend: any) => {
    const res = await fetch(`${API_BASE_URL}product/addProduct`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
    if (data.status !== 200) {
        return {
            status: false,
            data: data.message
        }
    } else {
        return {
            status: true,
            data: data,
            message: data.message
        }
    }
}

export const updateProduct = async (dataToSend: any) => {
    const res = await fetch(`${API_BASE_URL}product/updateProduct`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
    if (data.status !== 200) {
        return {
            status: false,
            data: data.message
        }
    } else {
        return {
            status: true,
            data: data,
            message: data.message
        }
    }
}


// PURCHASE
export const getAllWalletByPurchaseId = async (dataToSend: any) => {
    const res = await fetch(`${API_BASE_URL}purchase/buyProduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
    if (data.status !== 200) {
        return {
            status: false,
            data: data.message
        }
    } else {
        return {
            status: true,
            data: data
        }
    }
}