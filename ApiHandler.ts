const BASE_URL = "http://localhost:6000/api/";

// USER
export const registerUser = async (dataToSend: any) => {
    const res = await fetch(`${BASE_URL}user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
    console.log(data);
}


// PRODUCT
export const fetchAllProduct = async () => {
    // console.log('From API Handler File');

    const res = await fetch(`${BASE_URL}product/getAllProduct`);
    const data = await res.json();
    console.log(data);
}
export const fetchProductById = async (id: string) => {
    const res = await fetch(`${BASE_URL}product/getProduct/${id}`);
    const data = await res.json();
    console.log(data);
}
export const addProduct = async (dataToSend: any) => {
    const res = await fetch(`${BASE_URL}user/uploadImage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();

    if (data.status !== 200) {
        console.log(data.error)
    } else {
        const resToAddProduct = await fetch(`${BASE_URL}product/addProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: dataToSend.title,
                description: dataToSend.description,
                gMilkPrice: dataToSend.gMilkPrice,
                qtyAvailable: dataToSend.qtyAvailable,
                image: data.data.imagePath
            })
        });
        const dataToAddProduct = await resToAddProduct.json();
        console.log(dataToAddProduct);
    }
}
export const updateProduct = async (dataToSend: string) => {
    console.log('From API Handler File', dataToSend);

    const res = await fetch(`${BASE_URL}product/updateProduct`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
    console.log(data);
}


// PURCHASE
export const getAllWalletByPurchaseId = async (walletId: string) => {
    const res = await fetch(`${BASE_URL}purchase/getAllPurchaseByWalletId/${walletId}`);
    const data = await res.json();
    console.log(data);
}
export const buyProduct = async (dataToSend: string) => {
    const res = await fetch(`${BASE_URL}purchase/buyProduct`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
    console.log(data);
}