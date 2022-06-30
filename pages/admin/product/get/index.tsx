import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import style from "../../../marketplace/marketplace.module.scss";
import FilterIcon from "../../../../public/images/filterIcon.svg";
import { fetchAllProductAdmin, filterObj } from "ApiHandler";
import Loader from "../../../../components/common/Loader";
import toastr from "toastr";
import { ADMIN_ADDRESS_LIST } from "@config/abi-config";
import { useRouter } from "next/router";

const Admin = (props: any) => {
    const router = useRouter()
    const [filter, setFilter] = useState({ view: 'latest first', filter: 'latestFirst', urlParam: "product/getAllProduct" });
    const [ListToShow, setListToShow] = useState(filterObj.filter(el => el.filter !== filter.filter));
    const [isFilterListVisible, setIsFilterListVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [nftList, setNftList] = useState<any>([]);
    const [nftListStatus, setNftListStatus] = useState({ is: false, message: '' });
    const [isAdmin, setIsAdmin] = useState(false);

    const isValidUserToAccess = () => {
        let index = -1;
        if (props.isEnabled) {
            index = ADMIN_ADDRESS_LIST.findIndex(element => {
                return element.toLowerCase() === props.account.toLowerCase();
            });
        }
        return index >= 0 ? true : false;
    }

    useEffect(() => {
        if (!props.isEnabled || !isValidUserToAccess()) {
            setIsAdmin(false);
        } else {
            setIsAdmin(true)
        }
    }, [props.isEnabled]);

    const handleFilterListVisibility = () => setIsFilterListVisible(!isFilterListVisible);

    useEffect(() => {
        setListToShow(filterObj.filter(el => el.filter !== filter.filter));
    }, [filter]);

    const fetchAllProductHandler = async (sort: string, sortBy: number) => {
        if (props.isEnabled && isValidUserToAccess()) {
            setIsLoading(true)
            const { status, data } = await fetchAllProductAdmin(sort, sortBy, props.account);
            if (status) {
                setNftList(data);
                setNftListStatus({ is: status, message: data?.message });
            } else {
                toastr.error(data);
                setNftListStatus({ is: status, message: data })
            }
            setIsLoading(false)
        }
    }

    // const fetchUser = async () => {
    //     if (props.isEnabled && isValidUserToAccess()) {
    //         setIsAdmin(true);
    //         const { status, data } = await fetchAllProductAdmin("createdAt", -1, props.account);
    //         if (status) {
    //             setNftList(data);
    //             setNftListStatus({ is: status, message: data?.message });
    //         } else {
    //             toastr.error(data);
    //             setNftListStatus({ is: status, message: data })
    //         }
    //     } else {
    //         setIsAdmin(false);
    //     }
    // }

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

    useEffect(() => { fetchAllProductHandler("createdAt", 1); }, [props.isEnabled]);

    const connectWallet = () => props.connectWallet();
    const getShortAccountId = () => {
        let address = "" + (props.account ? props.account : "");
        return address.slice(0, 3) + "..." + address.slice(address.length - 5, address.length);
    }

    // When user is not admin
    if (!isAdmin) {
        return <div className={style.wrapper}>
            <Head>
                <title>GOATz - Admin</title>
            </Head>

            <div className={style.welcome__header}>
                <Container>
                    <div className={style["welcome__header--flex"]}>
                        <div className={style['welcome__header--heading']}>
                            WELCOME TO THE <br />MARKETPLACE
                        </div>
                    </div>
                </Container>
            </div>
            <Container style={{ marginTop: '16px' }}>
                {!props.isEnabled && <div className={style["filter__btn--flex"]}>
                    <button
                        className={style.btn}
                        onClick={() => props.connectWallet()}
                    >Connect Wallet</button>
                </div>}

                <h1 className={style.h1_title}>Unauthorized to access</h1>
            </Container>
        </div>
    }
    
    return (
        <div className={style.wrapper}>
            <Head>
                <title>GOATz - Admin</title>
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
                                <Link href={`/admin/product/update/${elm._id}`}>View</Link>
                            ) : (
                                <button onClick={() => toastr.info('You have to connect wallet first')}>View</button>
                            )}
                        </div>
                    </div>)}
                </div>
            </Container>}
        </div>
    )
}

export default Admin;