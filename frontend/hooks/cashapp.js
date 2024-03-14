import { useState, useEffect } from 'react';
import { getAvatarUrl } from '../functions/getAvatarUrl';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export const useCashApp = () => {
  const [userAddress, setUserAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState('');
  const [transactionPurpose, setTransactionPurpose] = useState('');

  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Get Avatar based on the userAddress
  useEffect(() => {
    if (connected) {
      setAvatar(getAvatarUrl(publicKey.toString()));
      setUserAddress(publicKey.toString());
    }
  }, [connected]);

  // Create the transaction
  const makeTransaction = async (fromWallet, toWallet, amount, reference) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    // Get a recent blockhash to include in the transaction
    const { blackhash } = await connection.getLatestBlockhash('finalized');
    const transaction = new Transaction({
      recentBlockhash: blackhash,
      feePayer: fromWallet,
    });

    // the instruction
    const transactionInstruction = SystemProgram.transfer({
      fromPubkey: fromWallet,
      lamports: amount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
      toPubkey: toWallet,
    });

    transactionInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });
    transaction.add(transactionInstruction);
    return transaction;
  };

  // create the function to run the transaction
  const doTransaction = async ({ amount, receiver, transactionPurpose }) => {
    const fromWallet = publicKey;
    const toWallet = new PublicKey(receiver);
    const bnAmount = new BigNumber(amount);
    const reference = Keypair.generate().publicKey;
    const transaction = await makeTransaction(
      fromWallet,
      toWallet,
      bnAmount,
      reference
    );

    const txnHash = await sendTransaction(transaction, connection);
    console.log(txnHash);

    // Create transaction history object
  };

  return {
    connected,
    publicKey,
    avatar,
    userAddress,
    doTransaction,
    amount,
    setAmount,
    receiver,
    setReceiver,
    transactionPurpose,
    setTransactionPurpose,
  };
};
