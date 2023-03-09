import { useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { Transaction, ForgeScript } from "@meshsdk/core";
import type { Mint, AssetMetadata } from "@meshsdk/core";



const Home: NextPage = () => {
    const { connected, wallet } = useWallet();
    const [assets, setAssets] = useState<null | any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function mintNFT() {
        // prepare forgingScript
        const usedAddress = await wallet.getUsedAddresses();
        const address = usedAddress[0];
        const forgingScript = ForgeScript.withOneSignature(address);

        const tx = new Transaction({ initiator: wallet });

        // define asset#1 metadata
        const assetMetadata: AssetMetadata = {
            "name": "Family",
            "image": "ipfs://QmTAuud1y5rreiDa54SNgmqTP3HSC5nWhhimbxd3eYemeZ",
            "mediaType": "image/jpg",
            "description": "Ngôi nhà và những đứa trẻ."
        };
        const asset: Mint = {
            assetName: 'Family',
            assetQuantity: '1',
            metadata: assetMetadata,
            /**
             * Mint NFT label = 721
             * Mint token label = 20 
             */
            label: '721',
            recipient: 'addr_test1qrgxqyjudt826l2wnl27zqws8jer2p7qa3gvnaqh0rk3y7x0m9jaz0z45nlx659a66gc03j3m4nz4vkghh4rq5gwjw4sqnfarm',
        };

        tx.mintAsset(
            forgingScript,
            asset,
        );

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash)
    }

    async function getAssets() {
        if (wallet) {
            setLoading(true);
            const _assets = await wallet.getAssets();
            setAssets(_assets);
            setLoading(false);
        }
    }


    async function sendADA() {
        const tx = new Transaction({ initiator: wallet })
            .sendLovelace(
                "addr_test1qrxpzfwdwtq9dzu2swe2hlmn9dptmz7dmv8cfs64va29xa03y2thexqurrtyve545ssjqmeywq40wanpqgyl654h57pqqz9eyd",
                "100000000"
            )
        // .sendLovelace("ANOTHER ADDRESS HERE....", "1500000");

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
    }

    return (
        <div>
            <h1>Connect Wallet</h1>
            <CardanoWallet />
            {connected && (
                <>
                    <h1>Mint NFT</h1>
                    {assets ? (
                        <pre>
                            <code className="language-js">
                                {JSON.stringify(assets, null, 2)}
                            </code>
                        </pre>
                    ) : (
                        <button
                            type="button"
                                onClick={() => mintNFT()}
                            disabled={loading}
                            style={{
                                margin: "8px",
                                backgroundColor: loading ? "orange" : "grey",
                            }}
                        >
                            Mint NFT
                        </button>


                    )}
                </>
            )}
        </div>
    );
};

export default Home;
