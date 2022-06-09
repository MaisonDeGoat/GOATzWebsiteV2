import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import style from "./marketplace.module.scss";
import PilotGoatImg from "../../public/images/PilotGoat.png";
import FilterIcon from "../../public/images/filterIcon.svg";
import { API_BASE_URL } from "ApiHandler";
import Loader from "../../components/common/Loader";

const filterObj = [
    {view: 'latest first', filter: 'latestFirst'},
    {view: 'price high-low', filter: 'priceHighLow'},
    {view: 'price low-high', filter: 'priceLowHigh'}
]

const Index = (props: any) => {
    const [filter, setFilter] = useState({view: 'latest first', filter: 'latestFirst'});
    const [ListToShow, setListToShow] = useState(filterObj.filter(el => el.filter !== filter.filter));
    const [isFilterListVisible, setIsFilterListVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [nftList, setNftList] = useState([]);

    const handleFilterListVisibility = () => setIsFilterListVisible(!isFilterListVisible);
    
    useEffect(() => {
        setListToShow( filterObj.filter(el => el.filter !== filter.filter) );
    }, [filter]);

    const handleFilter = (filter: any) => {
        setFilter(filter);
        setIsFilterListVisible(false);
    }

    const fetchAllProduct = async () => {
        setIsLoading(true)
        const res = await fetch(`${API_BASE_URL}product/getAllProduct`);
        const data = await res.json();
        console.log(data);
        if (data.status === 200) {
            setNftList(data.data)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchAllProduct();
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

            {isLoading ? <Loader /> : <Container>
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
                    {nftList?.map((elm: any) => <div className={style['nft__grid--card']} key={elm._id}>
                        <div className={style.item__img}>
                            <Image src={PilotGoatImg} alt="" />
                            {/* <div className={style["item__img--wrap"]}></div> */}
                        </div>
                        <div className={style.item__title}>{elm.title}</div>
                        <div className={style.item__price}>
                            <span>{elm.gMilkPrice} GMILK</span>
                            <Link href={`/marketplace/${elm._id}`}>BUY</Link>
                        </div>
                    </div> )}
                </div>
            </Container>}
        </div>
    )
}

export default Index