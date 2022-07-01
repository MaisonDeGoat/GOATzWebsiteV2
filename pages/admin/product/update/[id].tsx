import { Container } from "@mui/material";
import { API_BASE_URL, AUTH_TOKEN, API_SHEET_BASE_URL, fetchProductById, updateProduct, uploadImageOnAddProduct } from "ApiHandler";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import style from "../../../marketplace/marketplace.module.scss";
import Loader from "../../../../components/common/Loader";
import { ADMIN_ADDRESS_LIST, PRODUCT_LIST_TAB } from "@config/abi-config";
import toastr from "toastr";
import axios from "axios";

const UpdateNft = (props: any) => {
    const router = useRouter();
    const dragDropRef: any = useRef(null);
    const [fileList, setFileList] = useState<any>();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [qtyAvailable, setQtyAvailable] = useState(0);
    const [gMilkPrice, setGMilkPrice] = useState(0);
    const [fetchedImage, setFetchedImage] = useState(undefined);
    const [imgReview, setImgReview] = useState<any>();
    const [isNftActive, setIsNftActive] = useState(false);
    const [initialSupply, setInitialSupply] = useState(0);
    const [qtyPurchased, setQtyPurchased] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDuringUpdate, setIsLoadingDuringUpdate] = useState(false);

    const [nftDetails, setNftDetails] = useState<any>({});
    const [nftListStatus, setNftListStatus] = useState({ is: false, message: '' });

    const { id }: any = router.query;
    const fetchProductByIdHandler = async () => {
        setIsLoading(true);
        const { status, data } = await fetchProductById(id);
        if (!status) {
            setNftDetails({});
            setNftListStatus({ is: status, message: data?.message });
        } else {
            setNftListStatus({ is: status, message: data })
            setTitle(data.data?.title);
            setDescription(data.data?.description);
            setQtyAvailable(data.data?.qtyAvailable)
            setGMilkPrice(data.data?.gMilkPrice)
            setFetchedImage(data.data?.imagePath)
            setIsNftActive(data.data?.active)
            setInitialSupply(data.data?.initialSupply)
            setQtyPurchased(data.data?.qtyPurchased)
        }
        setIsLoading(false);
    }

    const fetchUser = async () => {
        if (props.isEnabled && isValidUserToAccess()) {
            setIsAdmin(true);
            fetchProductByIdHandler();
        } else {
            setIsAdmin(false);
        }
    }

    const onDragEnter = () => dragDropRef.current.classList.add('border_on_drag');
    const onDragLeave = () => dragDropRef.current.classList.remove('border_on_drag');
    const onDrop = () => dragDropRef.current.classList.remove('border_on_drag');

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

    const isValidUserToAccess = () => {
        let index = -1;
        if (props.isEnabled) {
            index = ADMIN_ADDRESS_LIST.findIndex(element => {
                return element.toLowerCase() === props.account.toLowerCase();
            });
        }
        return index >= 0 ? true : false;
    }

    const updateNFT = async (dataToSend: any) => {
        const { status, data, message } = await updateProduct({
            ...dataToSend,
            productId: id
        })
        if (!status) {
            toastr.error(data)
        } else {
            try {
                let res = await axios.get(
                    `${API_SHEET_BASE_URL}yAfhPYEVCwrlgHmz/search?tabId=${PRODUCT_LIST_TAB}&searchKey=product_id&searchValue=${id}`
                );

                if (res && res.status == 200 && res.data && res.data.length == 1 && res.data[0].row_id > 0) {
                    let putObj = {
                        row_id: res.data[0].row_id,
                        title: dataToSend.title,
                        description: dataToSend.description,
                        gMilkPrice: dataToSend.gMilkPrice,
                        quantity: dataToSend.initialSupply,
                        image: dataToSend.image_path
                    }
                    await axios.put(
                        `${API_SHEET_BASE_URL}yAfhPYEVCwrlgHmz?tabId=${PRODUCT_LIST_TAB}`,
                        putObj
                    )
                }
            } catch (e) {
                return null;
            }
            toastr.success(message);
        }
    }

    const updateNftHandler = async () => {
        if (props.isEnabled) {
            setIsLoadingDuringUpdate(true);
            let imageToUpdate;
            if (!fetchedImage) {
                if (!fileList) {
                    toastr.error('Please Select Your Image');
                } else {
                    const formdata = new FormData();
                    formdata.append("image", fileList)

                    const { status, data } = await uploadImageOnAddProduct(formdata);
                    if (!status) {
                        toastr.error(data)
                    } else {
                        const imgAddr = data.data.imagePath;
                        await updateNFT({
                            title,
                            description,
                            gMilkPrice,
                            initialSupply,
                            image_path: imgAddr,
                            active: isNftActive
                        });
                    }
                }
            } else {
                imageToUpdate = fetchedImage;
                await updateNFT({
                    title,
                    description,
                    gMilkPrice,
                    initialSupply,
                    image_path: imageToUpdate,
                    active: isNftActive
                })
            }

            setIsLoadingDuringUpdate(false);
        }
    }

    useEffect(() => {
        if (!props.isEnabled) {
            router.push('/')
        }
        fetchUser();
    }, [props.isEnabled]);

    return (
        <div className={style.wrapper}>
            <Head>
                <title>GOATz - Admin</title>
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

            <br />

            {isLoading ? <Loader /> : <Fragment>
                {!nftListStatus.is ? <Container>
                    <h1 className={style.h1_title}>{nftListStatus?.message}</h1>
                </Container> : <Container>
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
                            {fetchedImage ? (
                                <img
                                    src={fetchedImage}
                                    style={{ width: '100%', cursor: "pointer" }}
                                    alt=""
                                    title="Remove This Image"
                                    onClick={() => {
                                        setFetchedImage(undefined);
                                        setFileList('');
                                        setImgReview('');
                                    }}
                                />
                            ) : (
                                <Fragment>
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
                                </Fragment>
                            )}

                            {isLoadingDuringUpdate ? (
                                <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>UPDATING...</button>
                            ) : (
                                <button onClick={updateNftHandler}>UPDATE</button>
                            )}
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
                                <div className="">Initial QTY:</div>
                                <input
                                    type="number"
                                    placeholder="Enter QTY"
                                    value={initialSupply}
                                    onChange={(e: any) => setInitialSupply(e.target.value)}
                                />
                            </div>

                            <div className={style["form__right--grid"]}>
                                <div className="">QTY Purchased:</div>
                                <input
                                    type="number"
                                    value={qtyPurchased}
                                    onChange={(e: any) => setQtyPurchased(e.target.value)}
                                    disabled
                                    style={{ cursor: 'not-allowed' }}
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

                            {isNftActive ? (
                                <button onClick={() => setIsNftActive(false)} style={{ display: 'block', background: 'orangered' }}>Deactivate</button>
                            ) : (
                                <button onClick={() => setIsNftActive(true)} style={{ display: 'block' }}>Activate</button>
                            )}

                            {isLoadingDuringUpdate ? (
                                <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>UPDATING...</button>
                            ) : (
                                <button onClick={updateNftHandler}>UPDATE</button>
                            )}
                        </div>
                    </div>
                </Container>}
            </Fragment>}
        </div>
    )
}

export default UpdateNft