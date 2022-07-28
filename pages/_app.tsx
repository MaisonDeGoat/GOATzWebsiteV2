import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import Web3 from 'web3';
import toastr from 'toastr';
import App from 'next/app';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "@config/createEmotionCache";
import theme from "@config/theme";
import Layout from "@components/common/Layout";

import "./css/bootstrap.css";
import "./css/bootstrap-custom.css";
import "./css/custom.css";
import "./css/all.css";
import './toastr.css';

import { ETH_NETWORKS } from '../config/network-config'
import {
  CHAINID, CHAINID_HEX, LIST_ABI_GMILK_ERC20, GMILK_ABI_ADDRESS, LIST_ABI_STAKING, RPC,
  STAKING_ABI_ADDRESS, KIDZ_ABI_ADDRESS, LIST_ABI_KIDZ, GOATZ_ABI_ADDRESS, LIST_ABI_GOATZ
} from "../config/abi-config"

import Onboard from '@web3-onboard/core'
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import walletLinkModule from "@web3-onboard/walletlink";

const injected = injectedModule();
const walletConnect = walletConnectModule();
const walletLink = walletLinkModule();

const onboard = Onboard({
  wallets: [walletLink, walletConnect, injected],
  chains: [
    {
      id: CHAINID_HEX, // chain ID must be in hexadecimel
      token: "ETH", // main chain token
      namespace: "evm",
      label: "Ethereum Mainnet",
      rpcUrl: RPC
    }
  ],
  appMetadata: {
    name: "GOATz",
    icon: "/favicon.ico",
    logo: "/favicon.ico",
    description: "My app using Onboard",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" }
    ]
  },
  accountCenter: {
    desktop: {
      enabled: false
    },
    mobile: {
      enabled: false
    }
  }
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }: any) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  }

  state: any = {
    web3: null,
    networkType: null,
    chainId: null,
    account: null,
    isEnabled: false,
    isConnecting: false,
    gmilkWeb3Inst: null,
    stakingWeb3Inst: null,
    kidzWeb3Inst: null,
    goatzWeb3Inst: null,

    error: '',
    network: null,
    isLoading: false
  }

  async check() {
    await this.setState({ account: '0x6401694dbA7B91a105B0653Ce167cf5527B80456', isEnabled: true })
  }

  async switchNetworkToMainnet(provider: any, chainId: any) {
    if (provider) {
      try {
        provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ETH_NETWORKS[chainId].chainId }],
        }).then((res: any) => {
          this.connectWalletOnboard();
        }).catch((err: any) => {

        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await provider
              .request({
                method: 'wallet_addEthereumChain',
                params: [ETH_NETWORKS[chainId]],
              });
          } catch (error: any) {
            toastr.error(error.message);
          }
        }
      }
    }
  }

  connectWalletOnboard = async () => {
    try {
      const wallets = await onboard.connectWallet();
      if (wallets.length) {
        this.setState({ isLoading: true })
        const { accounts, chains, provider }: any = wallets[0];

        if (CHAINID.indexOf(Number(chains[0].id)) == -1) {
          this.switchNetworkToMainnet(provider, CHAINID[0]);
          // toastr.info('Wrong network choosen. Please choose Ethereum Mainnet');
          // this.setState({
          //   isEnabled: false,
          //   isConnecting: false,
          // });
          return;
        }

        let web3 = new Web3(provider);
        let gmilkWeb3Inst = new web3.eth.Contract(LIST_ABI_GMILK_ERC20 as any, GMILK_ABI_ADDRESS);
        let stakingWeb3Inst = new web3.eth.Contract(LIST_ABI_STAKING as any, STAKING_ABI_ADDRESS);
        let kidzWeb3Inst = new web3.eth.Contract(LIST_ABI_KIDZ as any, KIDZ_ABI_ADDRESS);
        let goatzWeb3Inst = new web3.eth.Contract(LIST_ABI_GOATZ as any, GOATZ_ABI_ADDRESS);
        this.setState({ web3: web3 });
        this.setState({ account: accounts[0].address });
        // this.setState({ account: "0xa2095eA8ea0D24860b3c2138D5B1A5214e3731D9" });
        this.setState({ chainId: chains[0].id });
        this.setState({
          isLoading: false,
          gmilkWeb3Inst: gmilkWeb3Inst,
          stakingWeb3Inst: stakingWeb3Inst,
          kidzWeb3Inst: kidzWeb3Inst,
          goatzWeb3Inst: goatzWeb3Inst,
        });
        this.setState({ isEnabled: true });
        
        console.log("this.set", this.state)

        this.setState({ web3: web3 });
        this.setState({ account: accounts[0].address });
        // this.setState({ account: "0xa2095eA8ea0D24860b3c2138D5B1A5214e3731D9" });
        this.setState({ chainId: chains[0].id });
        this.setState({
          isLoading: false,
          gmilkWeb3Inst: gmilkWeb3Inst,
          stakingWeb3Inst: stakingWeb3Inst,
          kidzWeb3Inst: kidzWeb3Inst,
          goatzWeb3Inst: goatzWeb3Inst,
        });
        this.setState({ isEnabled: true });
      }
    } catch (err) {
      // this.setState({ error: err })
      console.log(err);
    }
  }

  render() {
    const { Component, emotionCache = clientSideEmotionCache, pageProps }: any = this.props;
    return (
      <>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Layout>
              <Component
                {...pageProps}
                {...this.state}
                connectWallet={this.connectWalletOnboard}
              />
            </Layout>
          </ThemeProvider>
        </CacheProvider>

        {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" /> */}
        <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script async src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      </>
    );
  }
}
