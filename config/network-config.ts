export const ETH_NETWORKS: any = {
    1: {
        chainId: `0x${parseInt('1', 10).toString(16)}`,
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: ['https://rpc.ankr.com/eth'],
        blockExplorerUrls: ["https://etherscan.io"],
    }
};