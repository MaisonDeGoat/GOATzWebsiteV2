import { useRef, useState } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import style from "../marketplace/marketplace.module.scss";
import BackIcon from "../../public/images/backIcon.svg";
import { useRouter } from "next/router"
// import { addProduct } from "ApiHandler";
import { API_BASE_URL } from "ApiHandler";
import toastr from "toastr";

const Add = (props: any) => {
    const router = useRouter();
    const dragDropRef: any = useRef(null);
    const [fileList, setFileList] = useState<any>();

    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [qtyAvailable, setQtyAvailable] = useState('');
    const [gMilkPrice, setGMilkPrice] = useState('');
    const [imgReview, setImgReview] = useState<any>();

    const onDragEnter = () => dragDropRef.current.classList.add('border_on_drag');
    const onDragLeave = () => dragDropRef.current.classList.remove('border_on_drag');
    const onDrop = () => dragDropRef.current.classList.remove('border_on_drag');

    console.log(props);

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
                setImgReview( URL.createObjectURL(newFile) )
            } else {
                toastr.error("We Support Only svg, png, gif,jpg, jpeg");
            }
        }
    }

    const submitHandler = async () => {
        setIsLoading(true);
        if (!fileList) {
            toastr.error('Please Select Your Image');
        } else if (!title || !description || !qtyAvailable || !gMilkPrice) {
            toastr.error('Please Fill All The Fields Correctly');
        } else {
            // toastr.success(`${title} ${description} ${qtyAvailable} ${gMilkPrice}`)
            // addProduct({ title, description, qtyAvailable, gMilkPrice });
            const res = await fetch(`${API_BASE_URL}user/uploadImage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authentication: "Bearer"
                },
                body: JSON.stringify({ image: imgReview })
            });
            const data = await res.json();
            console.log(data);

            if (data.status !== 200) {
                toastr.error(data.message)
            } else {
                const resToAddProduct = await fetch(`${API_BASE_URL}product/addProduct`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        gMilkPrice,
                        qtyAvailable,
                        image: data.data.imagePath
                    })
                });
                const dataToAddProduct = await resToAddProduct.json();
                console.log(dataToAddProduct);
            }
        }
        setIsLoading(false);
    }

    return (
        <div className={style.wrapper}>
            <Head>
                <title>GOATz - Marketplace</title>
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
                    <button className={style.btn}>...00000</button>
                    <button className={style.btn} onClick={() => router.push('/admin/marketplace')}>
                        <Image src={BackIcon} width={36} height={36} objectFit="contain" alt="" />
                        <span>GO BACK</span>
                    </button>
                </div>

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
                        /> }
                        <button>LIST</button>
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
                                onChange={e => setQtyAvailable(e.target.value)}
                            />
                        </div>

                        <div className={style["form__right--grid"]}>
                            <div className="">GMILK Price:</div>
                            <input
                                type="number"
                                placeholder="Enter Price"
                                value={gMilkPrice}
                                onChange={e => setGMilkPrice(e.target.value)}
                            />
                        </div>

                        {!isLoading ? <button onClick={submitHandler}>LIST</button> : <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>LIST</button>}

                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Add