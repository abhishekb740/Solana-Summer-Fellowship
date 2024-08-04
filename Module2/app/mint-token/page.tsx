"use client";
import React, { useState } from 'react';
import { Connection, Keypair, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import bs58 from 'bs58';

const MintToken = () => {
  const [mintAddress, setMintAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  const mintTokens = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Replace this with your actual base58-encoded private key
    const base58PrivateKey = "4LYVtZ4wnxqt6AqtSsyzJuHCRSTM6K7QBTgBKCmKREk9y4jAtDjeF262CkfW6KyEGXbt7Ygyajh5jbunaPH32Y6B";
    const secretKey = bs58.decode(base58PrivateKey);
    const payer = Keypair.fromSecretKey(secretKey);

    const mint = new PublicKey(mintAddress);
    const destination = new PublicKey(destinationAddress);

    // Get or create the associated token account for the destination
    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

    // Mint tokens
    try {
      const transaction = await mintTo(
        connection,
        payer,
        mint,
        destinationTokenAccount.address,
        payer,
        amount
      );
      await connection.confirmTransaction(transaction, 'confirmed');
      setTransactionStatus('Minting successful');
    } catch (error) {
      console.error(error);
      setTransactionStatus('Minting failed');
    }
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <h2>Mint Token</h2>
      <input
        type="text"
        placeholder="Mint Address"
        value={mintAddress}
        onChange={(e) => setMintAddress(e.target.value)}
        className="p-2 m-2 border rounded text-black"
      />
      <input
        type="text"
        placeholder="Destination Address"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
        className="p-2 m-2 border rounded text-black"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="p-2 m-2 border rounded text-black"
      />
      <button onClick={mintTokens} className="p-4 m-2 bg-blue-500 text-white rounded">
        Mint Tokens
      </button>
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default MintToken;