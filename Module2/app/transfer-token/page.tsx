"use client";
import React, { useState } from 'react';
import { Connection, Keypair, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import bs58 from 'bs58';

const ManageToken = () => {
  const [mintAddress, setMintAddress] = useState<string>('');
  const [sourceAddress, setSourceAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  const transferTokens = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    const base58PrivateKey = "4LYVtZ4wnxqt6AqtSsyzJuHCRSTM6K7QBTgBKCmKREk9y4jAtDjeF262CkfW6KyEGXbt7Ygyajh5jbunaPH32Y6B";
    const secretKey = bs58.decode(base58PrivateKey);
    const payer = Keypair.fromSecretKey(secretKey);

    const mint = new PublicKey(mintAddress);
    const source = new PublicKey(sourceAddress);
    const destination = new PublicKey(destinationAddress);

    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      source
    );
    
    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

    try {
      const transaction = await transfer(
        connection,
        payer,
        sourceTokenAccount.address,
        destinationTokenAccount.address,
        payer,
        amount
      );
      await connection.confirmTransaction(transaction, 'confirmed');
      setTransactionStatus('Transfer successful');
    } catch (error) {
      console.error(error);
      setTransactionStatus('Transfer failed');
    }
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <h2>Manage Token</h2>

      {/* Transfer Token */}
      <h3 className="mt-6">Transfer Token</h3>
      <input
        type="text"
        placeholder="Mint Address"
        value={mintAddress}
        onChange={(e) => setMintAddress(e.target.value)}
        className="p-2 m-2 border rounded text-black"
      />
      <input
        type="text"
        placeholder="Source Address"
        value={sourceAddress}
        onChange={(e) => setSourceAddress(e.target.value)}
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
      <button onClick={transferTokens} className="p-4 m-2 bg-green-500 text-white rounded">
        Transfer Tokens
      </button>

      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default ManageToken;