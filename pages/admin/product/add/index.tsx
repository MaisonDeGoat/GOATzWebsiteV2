import { useRef, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";

import style from "../../../marketplace/marketplace.module.scss";
import BackIcon from "../../../public/images/backIcon.svg";
import { useRouter } from "next/router"
import { addProduct, API_BASE_URL, API_SHEET_BASE_URL, AUTH_TOKEN, uploadImageOnAddProduct } from "ApiHandler";
import toastr from "toastr";
import Loader from "../../../../components/common/Loader";
import { ADMIN_ADDRESS_LIST, PRODUCT_LIST_TAB } from "@config/abi-config";


const AddProduct = (props: any) => {
    const router = useRouter();
    const dragDropRef: any = useRef(null);
    const [fileList, setFileList] = useState<any>();

    const [isLoading, setIsLoading] = useState(false);
    const [isUserAdminLoading, setIsUserAdminLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [qtyAvailable, setQtyAvailable] = useState(0);
    const [gMilkPrice, setGMilkPrice] = useState(0);
    const [imgReview, setImgReview] = useState<any>();

    const fetchUser = async () => {
        if (props.isEnabled && isValidUserToAccess()) {
            // setIsUserAdminLoading(true);
            // const res = await fetch(`${API_BASE_URL}user/getUserByWalletId/${props.account}`, {
            //     method: 'GET',
            //     headers: {
            //         "Authorization": `Bearer ${AUTH_TOKEN}`
            //     }
            // });
            // const data = await res.json();
            // setIsUserAdminLoading(false);

            // if (data.status !== 200) {
            //     // router.push("/")
            //     setIsAdmin(false)
            // } else {
            setIsAdmin(true);
            // }
        } else {
            setIsAdmin(false);
        }
    }
    useEffect(() => { fetchUser() }, [props.isEnabled]);

    const onDragEnter = () => dragDropRef.current.classList.add('border_on_drag');
    const onDragLeave = () => dragDropRef.current.classList.remove('border_on_drag');
    const onDrop = () => dragDropRef.current.classList.remove('border_on_drag');

    const isValidUserToAccess = () => {
        let index = -1;
        if (props.isEnabled) {
            index = ADMIN_ADDRESS_LIST.findIndex(element => {
                return element.toLowerCase() === props.account.toLowerCase();
            });
        }
        return index >= 0 ? true : false;
    }

    const onFileDrop = (e: any) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const newFileExt = newFile?.name?.split('.').pop();
            if (
                newFileExt === 'svg' ||
                newFileExt === 'png' ||
                newFileExt === 'gif' ||
                newFileExt === 'jpg' ||
                newFileExt === 'jpeg'
            ) {
                setFileList(newFile);
                setImgReview(URL.createObjectURL(newFile))
            } else {
                toastr.error("We Support Only svg, png, gif,jpg, jpeg");
            }
        }
    }

    const submitNftHandler = async () => {
        if (props.isEnabled && isValidUserToAccess()) {
            setIsLoading(true);
            if (!fileList) {
                toastr.error('Please Select Your Image');
            } else if (!title || !description || !qtyAvailable || !gMilkPrice) {
                toastr.error('Please Fill All The Fields Correctly');
            } else if (qtyAvailable < 1 || gMilkPrice < 1) {
                toastr.error('Quantity And Price Must Be In Positive')
            } else {
                const formdata = new FormData();
                formdata.append("image", fileList)
                const { status: statusOnImage, data } = await uploadImageOnAddProduct(formdata);
                if (!statusOnImage) {
                    toastr.error(data)
                } else {
                    const { status, data: dataToAddProduct, message } = await addProduct({
                        title,
                        description,
                        gMilkPrice,
                        initialSupply: qtyAvailable,
                        imagePath: data.data.imagePath
                    });
                    console.log(status, dataToAddProduct)
                    if (!status) {
                        toastr.error(dataToAddProduct?.message)
                        setIsLoading(false);
                    } else {
                        console.log(dataToAddProduct);
                        let productObj: any = [[
                            dataToAddProduct?.data?.title,
                            dataToAddProduct?.data?.description,
                            dataToAddProduct?.data?.gMilkPrice,
                            dataToAddProduct?.data?.initialSupply,
                            dataToAddProduct?.data?.imagePath,
                            dataToAddProduct?.data?._id
                        ]]
                        await onSetRecordToSheet(productObj)
                        toastr.success(message);
                        setFileList('');
                        setTitle('');
                        setDescription('');
                        setQtyAvailable(0);
                        setGMilkPrice(0);
                        setImgReview('');
                    }
                }
            }
            setIsLoading(false);
        }
    }

    const onSetRecordToSheet = async (data: any) => {
        try {
            let res = await axios.post(
                `${API_SHEET_BASE_URL}yAfhPYEVCwrlgHmz`,
                data,
                { params: { tabId: PRODUCT_LIST_TAB } }
            )
            return res.data;
        } catch (e) {
            return null;
        }
    }

    const connectWallet = () => props.connectWallet();

    const getShortAccountId = () => {
        let address = "" + (props.account ? props.account : "");
        return address.slice(0, 3) + "..." + address.slice(address.length - 5, address.length);
    }

    if (isUserAdminLoading) {
        return <div className={style.wrapper}>
            <Loader />
        </div>;
    }

    return (
        <div className={style.wrapper}>
            <Head>
                <title>GOATz - Add Product To Marketplace</title>
            </Head>

            <div className={style.welcome__header}>
                <Container>
                    <div className={style["welcome__header--flex"]}>
                        <div className={style['welcome__header--heading']}>
                            ADD TO ITEM <br />TO MARKETPLACE
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                <div className={style["filter__btn--flex"]}>
                    {props.isEnabled ? (
                        <button className={style.btn}>{getShortAccountId()}</button>
                    ) : <button className={style.btn} onClick={connectWallet}>Connect Wallet</button>}

                    {/* <button className={style.btn} onClick={() => router.push('/admin/marketplace')}>
                        <Image src={BackIcon} width={36} height={36} objectFit="contain" alt="" />
                        <span>GO BACK</span>
                    </button> */}
                </div>
            </Container>

            {isAdmin && isValidUserToAccess() ? <Container>
                <div className={style["add__item--input-name-container"]}>
                    <input
                        type="text"
                        placeholder="ENTER TITLE"
                        className={style["add__item--input-name"]}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className={style.form__flex}>
                    <div className={style.form__left}>
                        {!imgReview ? <div
                            className={style.image__container}
                            ref={dragDropRef}
                            onDragEnter={onDragEnter}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        >
                            <p className={style.rotate__text}>Upload Image</p>
                            <input
                                type="file" value="" onChange={onFileDrop}
                                accept="image/png, image/gif, image/jpeg, image/svg"
                            />
                        </div> : <img
                            src={imgReview}
                            style={{ width: '100%', cursor: "pointer" }}
                            alt=""
                            title="Remove This Image"
                            onClick={() => {
                                setFileList('');
                                setImgReview('');
                            }}
                        />}
                        {!isLoading
                            ? <button onClick={submitNftHandler}>LIST</button>
                            : <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>LIST</button>}
                    </div>

                    <div className={style.form__right}>
                        <div className={style["form__right--grid"]}>
                            <div className="">ITEM DESCRIPTION:</div>
                            <textarea
                                placeholder="Enter Here"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className={style["form__right--grid"]}>
                            <div className="">QTY Avaliable:</div>
                            <input
                                type="number"
                                placeholder="Enter QTY"
                                value={qtyAvailable}
                                onChange={(e: any) => setQtyAvailable(e.target.value)}
                            />
                        </div>

                        <div className={style["form__right--grid"]}>
                            <div className="">GMILK Price:</div>
                            <input
                                type="number"
                                placeholder="Enter Price"
                                value={gMilkPrice}
                                onChange={(e: any) => setGMilkPrice(e.target.value)}
                            />
                        </div>

                        {!isLoading
                            ? <button onClick={submitNftHandler}>LIST</button>
                            : <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>LIST</button>}

                    </div>
                </div>
            </Container>
                :
                <Container>
                    <h1 className={style.h1_title}>Unauthorized to access</h1>
                </Container>
            }
        </div>
    )
}

export default AddProduct