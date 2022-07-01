import { useState, useEffect, Fragment } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import style from "./marketplace.module.scss";
import BackIcon from "../../public/images/backIcon.svg";
import { useRouter } from "next/router"
import { API_BASE_URL, API_SHEET_BASE_URL, fetchProductById, getAllWalletByPurchaseId } from "ApiHandler";
import Loader from "../../components/common/Loader";
import toastr from "toastr";
import loadingImg from "../../public/images/Spin.gif";
import { BUY_ORDER_TAB, GMILK_RECEIVER } from "@config/abi-config";
import axios from "axios";

const SingleNftDetails = (props: any) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDuringBuy, setIsLoadingDuringBuy] = useState(false);
    const [nftDetails, setNftDetails] = useState<any>({});
    const [nftListStatus, setNftListStatus] = useState({ is: false, message: '' });
    const [quantity, setQuantity] = useState<any>();
    const [mintedGoatzIdList, setMintedGoatzIdList] = useState<any>([]);
    const [mintedGoatzObjList, setMintedGoatzObjList] = useState<any>([]);
    const [isGoatzLoading, setIsGoatzLoading] = useState(false);
    const [firstSelectedGoat, setFirstSelectedGoat] = useState<any>(null);
    const { id }: any = router.query;

    const fetchProductByIdHandler = async () => {
        setIsLoading(true);
        const { status, data } = await fetchProductById(id);
        if (status) {
            setNftDetails(data.data);
            setNftListStatus({ is: status, message: data?.message });
        } else {
            toastr.error(data);
            setNftListStatus({ is: status, message: data })
        }
        setIsLoading(false);
    }

    const getMintedGoatz = async () => {
        if (props.isEnabled) {
            setIsGoatzLoading(true)
            let totalGoatz = await props.goatzWeb3Inst?.methods.balanceOf(props.account).call();
            if (totalGoatz > 0) {
                let list: any[] = [];
                getMintedGoatzList(list, totalGoatz, 0);
            } else {
                setIsGoatzLoading(false)
            }
        }
    }

    const getMintedGoatzList = async (list: any[], totalGoatz: number, index: number) => {
        // console.log(list, totalGoatz, index);
        setIsGoatzLoading(true)
        if (index <= totalGoatz - 1) {
            let temp = await props.goatzWeb3Inst?.methods.tokenOfOwnerByIndex(props.account, index).call();
            list.push(temp)

            getMintedGoatzList(list, totalGoatz, index + 1);
        } else if (index > totalGoatz - 1) {
            setMintedGoatzIdList(list)
            if (list && list.length > 0) {
                getMintedGoatzObj([], 0, list.length, list)
            }
        } else {
            setIsGoatzLoading(false)
        }
    }

    const getMintedGoatzObj = async (goatzList: any[], index: number, totalLength: number, list: string[]) => {
        // console.log(goatzList, index, totalLength, list)
        if (index <= totalLength - 1) {
            let url = await props.goatzWeb3Inst?.methods.tokenURI(list[index]).call();
            fetch(url)
                .then(res => res.json())
                .then(
                    (result) => {
                        for (let attr of result?.attributes) {
                            result[attr.trait_type] = attr.value;
                        }
                        result['id'] = list[index];
                        goatzList.push(result);
                        getMintedGoatzObj(goatzList, index + 1, totalLength, list)
                        // console.log(result);
                    },
                    (error) => {
                        getMintedGoatzObj(goatzList, index, totalLength, list)
                    }
                )
        } else if (index > totalLength - 1) {
            setMintedGoatzObjList(goatzList)
            setIsGoatzLoading(false)
        } else {
            getMintedGoatzObj(goatzList, index + 1, totalLength, list);
        }
    }

    const getLeftPanelGoatz = () => {
        if (mintedGoatzObjList && mintedGoatzObjList.length > 0) {
            return mintedGoatzObjList.map((e: any, key: any) => {
                return <li className={style["image__list--wrapper-img"]} key={key}>
                    <>
                        <style jsx>{`
                            .mintedGoatzObjList__border { border: ${e.id === firstSelectedGoat?.id ? 'solid 3px red' : 'none'} }
                        `}</style>
                        <img
                            className="mb-4 mintedGoatzObjList__border"
                            src={e.image}
                            onClick={() => {
                                imageSelection(e)
                            }}
                            alt=""
                        />
                    </>
                </li>
            })
        }
    }

    const imageSelection = (goatzObj: any) => setFirstSelectedGoat(goatzObj);

    useEffect(() => {
        setFirstSelectedGoat(null)
        getMintedGoatz()
    }, [props.isEnabled])

    useEffect(() => {
        if (!props.isEnabled) {
            router.push('/marketplace')
        }
        fetchProductByIdHandler()
    }, [])

    const getShortAccountId = () => {
        let address = "" + (props.account ? props.account : "");
        return address.slice(0, 3) + "..." + address.slice(address.length - 5, address.length);
    }

    const handleBuy = async () => {
        setIsLoadingDuringBuy(true);
        if (!props.isEnabled) {
            setIsLoadingDuringBuy(false);
            toastr.warning("Please Connect With Wallet!");
            props.connectWallet();
        } else if (!quantity) {
            setIsLoadingDuringBuy(false);
            toastr.error("Quantity must be greater than or equal to 1");
            return;
        } else if (quantity < 1) {
            setIsLoadingDuringBuy(false);
            toastr.error("Quantity must be greater than or equal to 1");
            return;
        } else if (quantity >= nftDetails.qtyAvailable) {
            setIsLoadingDuringBuy(false);
            toastr.error(`Quantity Must Be Less Than ${nftDetails.qtyAvailable}.`);
            return;
        } else {
            let balance = await props.gmilkWeb3Inst.methods.balanceOf(props.account).call();
            const MULTIPLIER = Math.pow(10, 18);
            const BN = props.web3.utils.BN;
            let totalPrice = (new BN(nftDetails.gMilkPrice).mul(new BN(quantity))).mul(new BN(MULTIPLIER.toString()));
            if (Number(balance) < Number(totalPrice)) {
                setIsLoadingDuringBuy(false);
                toastr.error("Insufficient GMILK for transaction");
                return;
            }
            try {
                const args = [GMILK_RECEIVER, totalPrice];
                const sendObj: any = {
                    from: props.account
                };

                const gasLimit = await props.gmilkWeb3Inst.methods.transfer(...args).estimateGas(sendObj);
                sendObj["gasLimit"] = props.web3.utils.toHex(gasLimit.toString());

                let gasPriceAsync = await props.web3.eth.getGasPrice();
                gasPriceAsync = Number(gasPriceAsync) + Number(10000000000);
                sendObj["gasPrice"] = props.web3.utils.toHex(gasPriceAsync.toString());

                let txHash: any = null;
                props.gmilkWeb3Inst.methods.transfer(...args)
                    .send(sendObj)
                    .on('transactionHash', async (hash: any) => {
                        txHash = hash;
                        const { status, data } = await getAllWalletByPurchaseId({
                            walletId: props.account,
                            productId: id,
                            quantity: quantity,
                            txHash: hash
                        })
                        if (status) {
                            setIsLoadingDuringBuy(false);
                            toastr.success("Purchased request sent to the blockchain");
                            let buyItemObj: any = [[
                                data.data.walletId,
                                data.data.productId,
                                data.data.quantity,
                                hash,
                                'In Progress',
                                firstSelectedGoat.id
                            ]]
                            await onSetBuyRecordToSheet(buyItemObj);
                            router.push('/marketplace');
                            return;
                            // transaction send to the blockchain
                        } else {
                            setIsLoadingDuringBuy(false);
                            toastr.error(data);
                            return;
                        }
                    })
                    .on('receipt', (receipt: any) => {
                        setIsLoadingDuringBuy(false);
                        // console.log(receipt);
                        // Call success API
                        onSetSuccessFailureRecordToSheet(receipt.transactionHash, 'SUCCESS');
                        toastr.success("Last purchase successful");
                        return;
                    })
                    .on('error', (error: any, receipt: any) => {
                        if (receipt.transactionHash) {
                            onSetSuccessFailureRecordToSheet(receipt.transactionHash, 'FAILED');
                        }
                        if (error.code === 4001) {
                            setIsLoadingDuringBuy(false);
                            toastr.error(error.message);
                            return;
                        } else {
                            setIsLoadingDuringBuy(false);
                            toastr.error("Oops! Something went wrong. Please try again");
                            return;
                        }
                    });

            } catch (e: any) {
                if (e.code === 4001) {
                    setIsLoadingDuringBuy(false);
                    toastr.error(e.message);
                    return;
                } else {
                    setIsLoadingDuringBuy(false);
                    toastr.error("Oops! Something went wrong. Please try again");
                    return;
                }
            }
        }
        setIsLoadingDuringBuy(false);
    }

    const onSetBuyRecordToSheet = async (data: any) => {
        try {
            let res = await axios.post(
                `${API_SHEET_BASE_URL}yAfhPYEVCwrlgHmz`,
                data,
                { params: { tabId: BUY_ORDER_TAB } }
            )
            return res.data;
        } catch (e) {
            return null;
        }
    }

    const onSetSuccessFailureRecordToSheet = async (txHash: string, status: string) => {
        try {
            let res = await axios.get(
                `${API_SHEET_BASE_URL}yAfhPYEVCwrlgHmz/search?tabId=${BUY_ORDER_TAB}&searchKey=txHash&searchValue=${txHash}`
            )
            if (res && res.status == 200 && res.data && res.data.length == 1 && res.data[0].row_id > 0) {
                let putObj = {
                    row_id: res.data[0].row_id,
                    status: status
                }
                await axios.put(
                    `${API_SHEET_BASE_URL}yAfhPYEVCwrlgHmz?tabId=${BUY_ORDER_TAB}`,
                    putObj
                )
            }
        } catch (e) {
            return null;
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
                    {props.isEnabled
                        ? <button className={style.btn}>{getShortAccountId()}</button>
                        : ' '}

                    <button className={style.btn} onClick={() => router.push('/marketplace')}>
                        <Image src={BackIcon} width={36} height={36} objectFit="contain" alt="" />
                        <span>GO BACK</span>
                    </button>
                </div>
            </Container>

            {isLoading ? <Loader /> : <Fragment>
                {!nftListStatus.is ? (
                    <h1 className={style.h1_title}>{nftListStatus.message}</h1>
                ) : <Container>
                    <div className={style.goatz__heading}>{nftDetails?.title}</div>

                    <div className={style["goatz__details--flex"]}>
                        <div className={style["goatz__details--img"]}>
                            <img
                                src={nftDetails?.imagePath}
                                alt={nftDetails?.title}
                                style={{ width: '100%', objectFit: "contain" }}
                            />

                            {firstSelectedGoat ? <Fragment>
                                {(!isLoadingDuringBuy) ? (
                                    <button onClick={handleBuy}>BUY</button>
                                ) : (
                                    <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>BUYING...</button>
                                )}
                            </Fragment> : <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>Select GOATz</button>}

                        </div>

                        <div className={style["goatz__details--details"]}>
                            <div className={style.description}>
                                <p>ITEM DESCRIPTION:</p>
                                <p>{nftDetails?.description}</p>
                            </div>

                            <div className={style["image__list--wrapper"]}>
                                {isGoatzLoading ? <div style={{ textAlign: "center", margin: "0px", paddingBottom: '16px' }}>
                                    <img src={loadingImg.src} style={{ height: '50px', width: '50px' }} alt="" />
                                    <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>Loading...</div>
                                </div> : (<>
                                    {mintedGoatzObjList.length === 0 ? (
                                        <div className={style.message}>No GOATz</div>
                                    ) : (
                                        <ul>
                                            {getLeftPanelGoatz()}
                                        </ul>
                                    )}
                                </>)}
                            </div>

                            {firstSelectedGoat && <input
                                type="number"
                                placeholder="ENTER QUANTITY"
                                className={style.number__input}
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                            />}
                        </div>
                    </div>
                </Container>}
            </Fragment>}

            {/* {isLoading ? <Loader /> : <Fragment>
                {!nftDetailsSuccess ? <Container>
                    <h1 className={style.h1_title}>{nftDetails?.message}</h1>
                </Container> : <Container>
                    <div className={style.goatz__heading}>{nftDetails?.title}</div>

                    <div className={style["goatz__details--flex"]}>
                        <div className={style["goatz__details--img"]}>
                            <img
                                src={nftDetails?.imagePath}
                                alt={nftDetails?.title}
                                style={{ width: '100%', objectFit: "contain" }}
                            />

                            {firstSelectedGoat ? <Fragment>
                                {(!isLoadingDuringBuy) ? (
                                    <button onClick={handleBuy}>BUY</button>
                                ) : (
                                    <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>BUYING...</button>
                                )}
                            </Fragment> : <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>Select GOATz</button>}

                        </div>

                        <div className={style["goatz__details--details"]}>
                            <div className={style.description}>
                                <p>ITEM DESCRIPTION:</p>
                                <p>{nftDetails?.description}</p>
                            </div>

                            <div className={style["image__list--wrapper"]}>
                                {isGoatzLoading ? <div style={{ textAlign: "center", margin: "0px", paddingBottom: '16px' }}>
                                    <img src={loadingImg.src} style={{ height: '50px', width: '50px' }} alt="" />
                                    <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>Loading...</div>
                                </div> : (<>
                                    {mintedGoatzObjList.length === 0 ? (
                                        <div className={style.message}>No GOATz</div>
                                    ) : (
                                        <ul>
                                            {getLeftPanelGoatz()}
                                        </ul>
                                    )}
                                </>)}
                            </div>

                            {firstSelectedGoat && <input
                                type="number"
                                placeholder="ENTER QUANTITY"
                                className={style.number__input}
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                            />}
                        </div>
                    </div>
                </Container>}
            </Fragment>} */}
        </div>
    )
}


export default SingleNftDetails;