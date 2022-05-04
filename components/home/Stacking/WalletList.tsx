import { Fragment, useState, useEffect } from "react";
import style from "./WalletList.module.scss";
import Image from "next/image";
import { Typography, Box } from "@mui/material";
import metamaskIcon from "../../../public/images/metamask-icon.svg";
import walletconnectIcon from "../../../public/images/walletconnect-circle-blue.svg";
import coinbaseIcon from "../../../public/images/coinbase-icon.png";
import { useWeb3React } from "@web3-react/core";

const WalletList = (props: any) => {
    
    return (
        <Fragment>
            {props.isWalletList && <div className={style.full_page_overlay}>
                <div className={style["full_page_overlay--bg"]} onClick={() => props.hideWalletListHandler()} />

                <div className={style.full_page_overlay_container}>
                    <div className={style.full_page_overlay_wrapper}>
                        <div className={style.wallet__grid}>

                            <div className={style.wallet__wrapper} onClick={() => {
                                props.connectToMetaMask()
                                props.hideWalletListHandler()
                            }}>
                                <Image src={metamaskIcon} alt="metamask" width="60px" height="60px" objectFit="cover" />
                                <Typography variant="h4" sx={{ fontWeight: "bold" }}>MetaMask</Typography>
                                <Box sx={{ fontSize: "default" }} className={style.grey}>Connect to your MetaMask Wallet</Box>
                            </div>

                            <div className={style.wallet__wrapper} onClick={() => {
                                props.connectToConnectWalletHandler('wallet_connect')
                                props.hideWalletListHandler()
                            }}>
                                <Image src={walletconnectIcon} alt="walletconnect" width="60px" height="60px" objectFit="cover" />
                                <Typography variant="h4" sx={{ fontWeight: "bold" }}>WalletConnect</Typography>
                                <Box sx={{ fontSize: "default" }} className={style.grey}>Scan with WalletConnect to connect</Box>
                            </div>

                            <div className={style.wallet__wrapper} onClick={() => {
                                props.connectToCoinbaseWallet()
                                props.hideWalletListHandler()
                            }}>
                                <Image src={coinbaseIcon} alt="metamask" width="60px" height="60px" objectFit="cover" />
                                <Typography variant="h4" sx={{ fontWeight: "bold" }}>Coinbase</Typography>
                                <Box sx={{ fontSize: "default" }} className={style.grey}>Connect to your Coinbase Wallet</Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </Fragment>
    )
}

export default WalletList;