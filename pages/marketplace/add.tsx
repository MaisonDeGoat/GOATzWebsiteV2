import { useRef, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import style from "./marketplace.module.scss";
import PilotGoatImg from "../../public/images/PilotGoat.png";
import BackIcon from "../../public/images/backIcon.svg";
import { useRouter } from "next/router"
import { addProduct } from "ApiHandler";
import toastr from "toastr";

const add = () => {
    const router = useRouter();
    const dragDropRef: any = useRef(null);
    const [fileList, setFileList] = useState();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [qtyAvailable, setQtyAvailable] = useState('');
    const [gMilkPrice, setGMilkPrice] = useState('');

    const onDragEnter = () => dragDropRef.current.classList.add('border_on_drag');
    const onDragLeave = () => dragDropRef.current.classList.remove('border_on_drag');
    const onDrop = () => dragDropRef.current.classList.remove('border_on_drag');

    const onFileDrop = (e: any) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFileList(newFile);
        }
    }

    const submitHandler = async () => {
        if (!fileList) {
            toastr.error('Please Select Your Image');
        } else if (!title || !description || !qtyAvailable || !gMilkPrice) {
            toastr.error('Please Fill All The Fields Correctly');
        } else {
            addProduct({ title, description, qtyAvailable, gMilkPrice });
        }
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
                    <button className={style.btn} onClick={() => router.push('/marketplace')}>
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
                        <div
                            className={style.image__container}
                            ref={dragDropRef}
                            onDragEnter={onDragEnter}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        >
                            <p className={style.rotate__text}>Upload Image</p>
                            <input 
                                type="file" value="" onChange={onFileDrop}
                                accept="image/png, image/gif, image/jpeg"
                            />
                        </div>
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

                        <button onClick={submitHandler}>LIST</button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default add