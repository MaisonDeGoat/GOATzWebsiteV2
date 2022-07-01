import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import style from "./marketplace.module.scss";
import PilotGoatImg from "../../public/images/PilotGoat.png";
import FilterIcon from "../../public/images/filterIcon.svg";
import prodImage from "../../public/images/placeholder_img.png";
import { API_BASE_URL, fetchAllProduct, filterObj } from "ApiHandler";
import Loader from "../../components/common/Loader";
import toastr from "toastr";

const Index = (props: any) => {
    const [filter, setFilter] = useState({ view: 'latest first', filter: 'latestFirst', urlParam: "product/getAllProduct" });
    const [ListToShow, setListToShow] = useState(filterObj.filter(el => el.filter !== filter.filter));
    const [isFilterListVisible, setIsFilterListVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [nftList, setNftList] = useState([]);
    const [nftListStatus, setNftListStatus] = useState({ is: false, message: '' });

    const handleFilterListVisibility = () => setIsFilterListVisible(!isFilterListVisible);

    useEffect(() => {
        setListToShow(filterObj.filter(el => el.filter !== filter.filter));
    }, [filter]);

    const fetchAllProductHandler = async (sort: string, sortBy: number) => {
        setIsLoading(true)
        const { status, data } = await fetchAllProduct(sort, sortBy);
        if (status) {
            setNftList(data);
            setNftListStatus({ is: status, message: data?.message });
        } else {
            toastr.error(data);
            setNftListStatus({ is: status, message: data })
        }
        setIsLoading(false)
    }

    const handleFilter = async (filter: any) => {
        setFilter(filter);
        setIsFilterListVisible(false);

        if (filter.filter === "priceHighLow") {
            await fetchAllProductHandler("gMilkPrice", -1);
        } else if (filter.filter === "priceLowHigh") {
            await fetchAllProductHandler("gMilkPrice", 1);
        } else {
            await fetchAllProductHandler("createdAt", -1);
        }
    }

    useEffect(() => {
        fetchAllProductHandler("createdAt", 1);
    }, [])

    const connectWallet = () => props.connectWallet();
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
                            WELCOME TO THE <br />GOATZ MARKETPLACE<br /> Alpha Release
                        </div>
                        <div className={style['welcome__header--box']}>
                            {/* PRODUCT IMAGE <br />PLACEHOLDER */}
                            <Image src={prodImage} width={'400%'} height={'400%'} objectFit="contain" alt="" />
                        </div>
                    </div>
                </Container>
            </div>

            {isLoading ? <Loader /> : <Container>
                <div className={style["filter__btn--flex"]}>
                    {props.isEnabled ? (
                        <button className={style.btn}>{getShortAccountId()}</button>
                    ) : (
                        <button className={style.btn} onClick={connectWallet}>Connect Wallet</button>
                    )}

                    <div className={`${style["filter__btn--wrapper"]} ${isFilterListVisible && style.relat}`}>
                        <div className={style.filter__btn} onClick={handleFilterListVisibility}>
                            <Image src={FilterIcon} alt="filter icon" height={30} width={30} objectFit="contain" />
                            <span>{filter.view}</span>
                        </div>
                        {isFilterListVisible && <div className={style.filter__list}>
                            {ListToShow.map((elm, i) => <div className={style.filter__btn} key={i} onClick={() => handleFilter(elm)}>
                                <div className={style.box}></div>
                                <span>{elm.view}</span>
                            </div>)}
                        </div>}
                    </div>
                </div>

                <div className={style.nft__grid}>
                    {!nftListStatus.is && <h1 className={style.h1_title}>{nftListStatus.message}</h1>}
                    {nftList?.map((elm: any) => <div className={style['nft__grid--card']} key={elm._id}>
                        <div className={style.item__img}>
                            <img
                                src={elm?.imagePath}
                                alt={elm.title}
                                style={{ width: '100%', height: '212px', objectFit: "cover" }}
                            />
                        </div>
                        <div className={style.item__title}>{elm.title}</div>
                        <div className={style.item__price}>
                            <span>{elm.gMilkPrice} GMILK</span>
                            {props.isEnabled ? (
                                <Link href={`/marketplace/${elm._id}`}>BUY</Link>
                            ) : (
                                <button onClick={() => toastr.info('Not Connected With Wallet')}>BUY</button>
                            )}
                        </div>
                    </div>)}
                </div>
            </Container>}
        </div>
    )
}

export default Index
