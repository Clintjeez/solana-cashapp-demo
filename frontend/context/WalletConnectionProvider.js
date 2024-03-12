import React, {useMemo} from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";

const WalletConctionProvider = ({children}) => {
    const endpoint = useMemo(() => "https://api.devnet.solana.com", [])

    const wallets = useMemo(() =>[new PhantomWalletAdapter()],[])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoconnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletConctionProvider;