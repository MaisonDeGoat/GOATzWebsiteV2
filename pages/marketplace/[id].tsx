import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import style from "./marketplace.module.scss";
import PilotGoatImg from "../../public/images/PilotGoat.png";
import BackIcon from "../../public/images/backIcon.svg";
import { useRouter } from "next/router"

const SingleMarketplaceDetails = () => {
    const router = useRouter();

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
                    <button className={style.btn}>...00000</button>
                    <button className={style.btn} onClick={() => router.push('/marketplace')}>
                        <Image src={BackIcon} width={36} height={36} objectFit="contain" alt="" />
                        <span>GO BACK</span>
                    </button>
                </div>

                <div className={style.goatz__heading}>NAME YOU GOATZ</div>

                <div className={style["goatz__details--flex"]}>
                    <div className={style["goatz__details--img"]}>
                        <Image src={PilotGoatImg} alt="" objectFit="contain" layout="intrinsic" />
                        <button>BUY</button>
                    </div>

                    <div className={style["goatz__details--details"]}>
                        <div className={style.description}>
                            <p>ITEM DESCRIPTION:</p>
                            <p>Take advantage of this opportunity to further personalize your GOAT and give it a proper name. All names are subject to review and at the descretion of GOATz can be made void due to copyright infrindgement</p>
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

                        {true && <input
                            type="text"
                            placeholder="ENTER NAME HERE"
                            className={style.name__input}
                        />}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default SingleMarketplaceDetails