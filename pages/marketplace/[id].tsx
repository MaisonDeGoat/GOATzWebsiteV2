import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Head from "next/head";
import Image from "next/image";
import style from "./marketplace.module.scss";
import PilotGoatImg from "../../public/images/PilotGoat.png";
import BackIcon from "../../public/images/backIcon.svg";
import { useRouter } from "next/router"
import { API_BASE_URL, API_SHEET_BASE_URL } from "ApiHandler";
import Loader from "../../components/common/Loader";
import toastr from "toastr";
import BigNumber from "bignumber.js";
import loadingImg from "../../public/images/Spin.gif";
import { BUY_ORDER_TAB } from "@config/abi-config";
import axios from "axios";

const SingleNftDetails = (props: any) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDuringBuy, setIsLoadingDuringBuy] = useState(false);
    const [nftDetails, setNftDetails] = useState<any>({});
    const [quantity, setQuantity] = useState<any>();
    const [mintedGoatzIdList, setMintedGoatzIdList] = useState<any>([]);
    const [mintedGoatzObjList, setMintedGoatzObjList] = useState<any>([]);
    const [isGoatzLoading, setIsGoatzLoading] = useState(false);
    const { id } = router.query;

    // console.log("gmilkWeb3Inst: ", props.gmilkWeb3Inst?.methods);

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

    const getMintedGoatz = async () => {
        // console.log(props, props.goatzWeb3Inst.methods);
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
                            .mintedGoatzObjList__border { border: ${e.selected ? 'solid 3px red' : 'none'} }
                        `}</style>
                        <img
                            className="mb-4 mintedGoatzObjList__border"
                            src={e.image}
                            // onClick={() => {
                            //     imageSelection(e);
                            // }}
                            alt=""
                        />
                    </>
                </li>
            })
        }
    }

    useEffect(() => {
        getMintedGoatz()
    }, [props.isEnabled])

    useEffect(() => {
        if (!props.isEnabled) {
            router.push('/marketplace')
        }
        fetchProductById()
    }, [])

    const getShortAccountId = () => {
        let address = "" + (props.account ? props.account : "");
        return address.slice(0, 3) + "..." + address.slice(address.length - 5, address.length);
    }

    const handleBuy = async () => {
        setIsLoadingDuringBuy(true);
        if (!props.isEnabled) {
            toastr.warning("Please Connect With Wallet!");
            props.connectWallet();
        } else if (!quantity) {
            toastr.error("Quantity Must Be 1 Or More Than 1.")
        } else if (quantity < 1) {
            toastr.error("Quantity Must Be 1 Or More Than 1.")
        } else if (quantity >= nftDetails.qtyAvailable) {
            toastr.error(`Quantity Must Be Less Than ${nftDetails.qtyAvailable}.`)
        } else {
            let balance = await props.gmilkWeb3Inst.methods.balanceOf(props.account).call();
            let totalPrice = (new BigNumber(nftDetails.gMilkPrice).multipliedBy(new BigNumber(quantity))).multipliedBy(new BigNumber(10).toExponential(18));

            if (balance < totalPrice) {
                toastr.error("Insufficient GMILk for transaction");
            }
            try {
                let gaslimit = await props.gmilkWeb3Inst.methods.transfer(props.account, totalPrice).estimateGas({
                    from: props.account,
                });

                let gasPriceAsync = await props.web3.eth.getGasPrice();

                gasPriceAsync = Number(gasPriceAsync) + Number(10000000000);
                let txHash: any = null;
                props.gmilkWeb3Inst.methods.transfer(props.account, totalPrice)
                    .send({
                        from: props.account,
                        gasLimit: props.web3.utils.toHex(gaslimit.toString()),
                        gasPrice: props.web3.utils.toHex(gasPriceAsync.toString())
                    })
                    .on('transactionHash', async (hash: any) => {
                        console.log("Transaction hash::", hash)
                        txHash = hash;
                        // sending data to database
                        const res = await fetch(`${API_BASE_URL}purchase/buyProduct`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                walletId: props.account,
                                productId: id,
                                quantity: quantity,
                                txHash: hash
                            })
                        });
                        const data = await res.json();
                        console.log(data)
                        if (data.status === 200) {
                            toastr.success(data.message);
                            let buyItemObj: any = [[
                                data.data.walletId,
                                data.data.productId,
                                data.data.quantity,
                                data.data.txHash,
                                'In Progress'
                            ]]
                            await onSetBuyRecordToSheet(buyItemObj)
                            // transaction send to the blockchain
                        } else {
                            toastr.error(data.message);
                        }
                    })
                    .on('receipt', (receipt: any) => {
                        console.log(receipt);//receipt.transactionHash
                        // Add one API
                        onSetSuccessFailureRecordToSheet(txHash, 'SUCCESS')
                    })
                    .on('error', (error: any, receipt: any) => {
                        toastr.error(error)
                        // Add one API
                        onSetSuccessFailureRecordToSheet(txHash, 'FAILED')
                    })

            } catch (e: any) {
                if (e.code === 4001) {
                    toastr.error(e.message);
                } else {
                    toastr.error("Oops! Something went wrong. Please try again");
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
            console.log(res)
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

            {isLoading ? <Loader /> : <Container>
                <div className={style.goatz__heading}>{nftDetails?.title}</div>

                <div className={style["goatz__details--flex"]}>
                    <div className={style["goatz__details--img"]}>
                        <img
                            src={nftDetails?.imagePath}
                            alt={nftDetails?.title}
                            style={{ width: '100%', objectFit: "contain" }}
                        />
                        {!isLoadingDuringBuy
                            ? <button onClick={handleBuy}>BUY</button>
                            : <button disabled style={{ opacity: '0.4', cursor: 'not-allowed', color: '#fff' }}>BUYING...</button>}

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

                        {props.isEnabled && <input
                            type="number"
                            placeholder="ENTER QUANTITY"
                            className={style.number__input}
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />}
                    </div>
                </div>
            </Container>}
        </div>
    )
}


export default SingleNftDetails;