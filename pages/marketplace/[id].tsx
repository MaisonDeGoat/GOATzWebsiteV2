import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import style from "./marketplace.module.scss";
import PilotGoatImg from "../../public/images/PilotGoat.png";
import BackIcon from "../../public/images/backIcon.svg";
import { useRouter } from "next/router"
import { API_BASE_URL } from "ApiHandler";
import Loader from "../../components/common/Loader";

const SingleMarketplaceDetails = (props: any) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [nftDetails, setNftDetails] = useState<any>({});
    const { id } = router.query;

    const fetchProductById = async () => {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}product/getProduct/${id}`);
        const data = await res.json();
        // console.log(data);
        if (data.status === 200) {
            setNftDetails(data.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchProductById()
    }, [])

    const getShortAccountId = () => {
        let address = "" + (props.account ? props.account : "");
        return address.slice(0, 3) + "..." + address.slice(address.length - 5, address.length);
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
                            WELCOME TO THE <br />MARKETPLACE
                        </div>
                        <div className={style['welcome__header--box']}>
                            PRODUCT IMAGE <br />PLACEHOLDER
                        </div>
                    </div>
                </Container>
            </div>

            {isLoading ? <Loader /> : <Container>
                <div className={style["filter__btn--flex"]}>
                    {props.isEnabled 
                    ? <button className={style.btn}>{getShortAccountId()}</button>
                    : ' '}
                    
                    <button className={style.btn} onClick={() => router.push('/marketplace')}>
                        <Image src={BackIcon} width={36} height={36} objectFit="contain" alt="" />
                        <span>GO BACK</span>
                    </button>
                </div>

                <div className={style.goatz__heading}>{nftDetails?.title}</div>

                <div className={style["goatz__details--flex"]}>
                    <div className={style["goatz__details--img"]}>
                        <Image src={PilotGoatImg} alt="" objectFit="contain" layout="intrinsic" />
                        <button>BUY</button>
                    </div>

                    <div className={style["goatz__details--details"]}>
                        <div className={style.description}>
                            <p>ITEM DESCRIPTION:</p>
                            <p>{nftDetails?.description}</p>
                        </div>

                        <div className={style["image__list--wrapper"]}>
                            <ul>
                                {(Array.from(Array(20).keys())).map((elm, i) => <li className={style["image__list--wrapper-img"]} key={i}>
                                    <Image
                                        src={PilotGoatImg}
                                        objectFit="contain"
                                        alt=""
                                    />
                                </li>)}
                            </ul>
                        </div>

                        {props.isEnabled && <input
                            type="text"
                            placeholder="ENTER NAME HERE"
                            className={style.name__input}
                        />}
                    </div>
                </div>
            </Container>}
        </div>
    )
}

export default SingleMarketplaceDetails