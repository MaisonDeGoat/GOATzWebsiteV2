import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import style from "./marketplace.module.scss";
import PilotGoatImg from "../../public/images/PilotGoat.png";
import FilterIcon from "../../public/images/filterIcon.svg";
import { fetchAllProduct, fetchProductById, getAllWalletByPurchaseId, registerUser } from "ApiHandler";

const filterObj = [
    {view: 'latest first', filter: 'latestFirst'},
    {view: 'price high-low', filter: 'priceHighLow'},
    {view: 'price low-high', filter: 'priceLowHigh'}
]

const index = () => {
    const [filter, setFilter] = useState({view: 'latest first', filter: 'latestFirst'});
    const [ListToShow, setListToShow] = useState(filterObj.filter(el => el.filter !== filter.filter));
    const [isFilterListVisible, setIsFilterListVisible] = useState(false);

    const handleFilterListVisibility = () => setIsFilterListVisible(!isFilterListVisible);
    
    useEffect(() => {
        setListToShow( filterObj.filter(el => el.filter !== filter.filter) );
    }, [filter]);

    const handleFilter = (filter: any) => {
        setFilter(filter);
        setIsFilterListVisible(false);
    }

    useEffect(() => {
        // fetchAllProduct();
        // fetchProductById('0x0000000000');
        // getAllWalletByPurchaseId('getAllWalletByPurchaseId');
        // registerUser( {walletId: "12349jfoiwer239ri3rfr23o2rn3o2p"} )
    }, [])
    

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

            <Container>
                <div className={style["filter__btn--flex"]}>
                    <div />
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
                    {[1, 2 , 3, 4, 5, 6].map((elm, i) => <div className={style['nft__grid--card']} key={i}>
                        <div className={style.item__img}>
                            <Image src={PilotGoatImg} alt="" />
                            {/* <div className={style["item__img--wrap"]}></div> */}
                        </div>
                        <div className={style.item__title}>NAME YOUR GOATZ</div>
                        <div className={style.item__price}>
                            <span>10,000 GMILK</span>
                            <Link href={`/marketplace/0x0000`}>BUY</Link>
                        </div>
                    </div> )}
                </div>
            </Container>
        </div>
    )
}

export default index