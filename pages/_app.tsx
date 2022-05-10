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
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";

import "./css/bootstrap.css";
import "./css/bootstrap-custom.css";
import "./css/custom.css";
import "./css/all.css";
import './toastr.css';

import { CHAINID, LIST_ABI_GMILK_ERC20, GMILK_ABI_ADDRESS, LIST_ABI_STAKING, RPC,
  STAKING_ABI_ADDRESS, KIDZ_ABI_ADDRESS, LIST_ABI_KIDZ, GOATZ_ABI_ADDRESS, LIST_ABI_GOATZ } from "../config/abi-config"

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
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     // console.log(this.state)
  //     // this.check()
  //     this.autoConnect();
  //   })

  // }

  async check() {
    await this.setState({ account: '0x6401694dbA7B91a105B0653Ce167cf5527B80456', isEnabled: true })
    console.log(this.state)
  }
  async autoConnect() {
    try {
      let web3 = null;
      if ((window as any).ethereum && (window as any).ethereum.isMetaMask) {
        web3 = new Web3((window as any).ethereum);
      }
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
          this.connectToMetaMaskNetwork();
        }
      }

    } catch (e) {
      // console.log("ERROR:::::::", e)
    }
  }

  async connectToMetaMaskNetwork() {
    if (this.state.isConnecting) {
      return;
    }
    this.setState({ isConnecting: true });
    try {
      if ((window as any).ethereum && (window as any).ethereum.isMetaMask) {

        this.state.web3 = new Web3((window as any).ethereum);
        // await this.connectAccount();
        (window as any).ethereum.on('chainChanged', (accounts: any) => {
          // this.handleAccountsChanged(accounts);
          // console.log("CHAIN CHANGE")
          this.setConfig();
        });
        (window as any).ethereum.on('accountsChanged', (accounts: any) => {
          // this.handleAccountsChanged(accounts);
          // console.log("Account Change");
          this.setConfig();
        });
        (window as any).ethereum.on('disconnect', () => {
          // // console.log("Disconnect Change")
        });
        try {
          await this.setConfig();
        } catch (e) {
          // User has denied account access to DApp...
          // console.log("ERROR:::::::::::::::::::::", e)
          toastr.error("Unable to connect.");
          await this.setState({ isEnabled: false });
        }
      } else {
        toastr.error("No Web3 Provider found! Please use wallet connect.")
        await this.setState({ isEnabled: false, isConnecting: false });
      }
    } catch (e) {
      await this.setState({ isEnabled: false, isConnecting: false });
    }
  }

  // Coinbase Connection
  async connectToCoinbase() {
    if (this.state.isConnecting) {
      return;
    }
    this.setState({ isConnecting: true });
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "GOATz",
        appLogoUrl: "",
        darkMode: false
      })
      const ethereum = coinbaseWallet.makeWeb3Provider(RPC, 1);

      this.state.web3 = new Web3(ethereum);

      ethereum.on('chainChanged', (accounts) => {
        this.setConfig();
      })

      ethereum.on('accountsChanged', (accounts) => {
        this.setConfig();
      })

      ethereum.on('disconnect', () => { })

      try {
        await this.setConfig();
      } catch (err) {
        toastr.error("Unable To Connect.");
        await this.setState({ isEnabled: false })
      }

    } catch (err) {
      await this.setState({ isEnabled: false, isConnecting: false })
    }
  }

  // walletConnect
  async connectToConnectWallet() {
    if (this.state.isConnecting) {
      return;
    }
    this.setState({ isConnecting: true });
    try {
      const provider: any = new WalletConnectProvider({
        rpc: { 1: RPC},
        bridge: "https://bridge.walletconnect.org",
        qrcode: true
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable().then(async (result: any) => {
        this.state.web3 = new Web3(provider);

        provider.on("networkChanged", (chainId: any) => {
          this.setConfig()
        })

        provider.on('chainChanged', (chainId: any) => {
          this.setConfig();
        })
        provider.on('accountsChanged', (chainId: any) => {
          document.location.reload();
        })
        provider.on("disconnect", (code: any, reason: any) => {
          // console.log(code, reason);
          document.location.reload();
        });

        try {
          await this.setConfig();
        } catch (e) {
          await this.setState({ isEnabled: false });
        }
      })
    } catch (err) {
      toastr.error("Unable To Connect");
      this.setState({ isEnable: false, isConnecting: false })
    }
  }

  async setConfig() {
    if (this.state.web3) {

      try {
        const networkId = await (window as any).ethereum.request({
          method: 'net_version'
        });
        // console.log("networkId::", networkId)
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts', })
        await this.configNetwork(networkId, accounts[0]);
      } catch (e) {
      }
    }

  }

  async switchNetworkToMainnet() {
    let web3: any = null;
    if ((window as any).ethereum && (window as any).ethereum.isMetaMask) {
      web3 = new Web3((window as any).ethereum);
    }
    if (web3) {
      try {
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: '0x' + (1).toString(16) }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await web3.currentProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: '0x' + (1).toString(16),
                  chainName: "Ethereum Mainnet",
                  rpcUrls: [RPC],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://etherscan.io"],
                },
              ],
            });
          } catch (error: any) {
            toastr.error(error.message);
          }
        }
      }
    }
  }

  async configNetwork(chainId: any, account: any) {
    chainId = Number(chainId);
    if (CHAINID.indexOf(chainId) == -1) {
      toastr.info('Wrong network choosen. Please choose Ethereum Mainnet');
      await this.setState({
        isEnabled: false,
        isConnecting: false,
      });
      this.switchNetworkToMainnet()
      return;
    } else if (CHAINID.indexOf(chainId) >= 0) {
      let gmilkWeb3Inst = new this.state.web3.eth.Contract(LIST_ABI_GMILK_ERC20, GMILK_ABI_ADDRESS);
      let stakingWeb3Inst = new this.state.web3.eth.Contract(LIST_ABI_STAKING, STAKING_ABI_ADDRESS);
      let kidzWeb3Inst = new this.state.web3.eth.Contract(LIST_ABI_KIDZ, KIDZ_ABI_ADDRESS);
      let goatzWeb3Inst = new this.state.web3.eth.Contract(LIST_ABI_GOATZ, GOATZ_ABI_ADDRESS);
      await this.setState({
        isEnabled: true,
        isConnecting: false,
        chainId: chainId,
        // account: '0x6401694dbA7B91a105B0653Ce167cf5527B80456',
        account: account,
        gmilkWeb3Inst: gmilkWeb3Inst,
        stakingWeb3Inst: stakingWeb3Inst,
        kidzWeb3Inst: kidzWeb3Inst,
        goatzWeb3Inst: goatzWeb3Inst,
      });
      console.log(this.state.isEnabled)
      toastr.success('Wallet connected successfully.');
    } else {
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
                connectToMetaMaskHandler={() => this.connectToMetaMaskNetwork()}
                connectToCoinbaseWallet={() => this.connectToCoinbase()}
                connectToConnectWalletHandler={() => this.connectToConnectWallet()}
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
