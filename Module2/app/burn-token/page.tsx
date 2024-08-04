"use client";
import React, { useState } from 'react';
import { Connection, Keypair, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo, getAccount, burn } from '@solana/spl-token';
import bs58 from 'bs58';

const ManageToken = () => {
  const [mintAddress, setMintAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [burnAmount, setBurnAmount] = useState<number>(0);

  const mintTokens = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    const base58PrivateKey = "4LYVtZ4wnxqt6AqtSsyzJuHCRSTM6K7QBTgBKCmKREk9y4jAtDjeF262CkfW6KyEGXbt7Ygyajh5jbunaPH32Y6B";
    const secretKey = bs58.decode(base58PrivateKey);
    const payer = Keypair.fromSecretKey(secretKey);

    const mint = new PublicKey(mintAddress);
    const destination = new PublicKey(destinationAddress);

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

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

  const burnTokens = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    const base58PrivateKey = "3zRY9L3mCwxJrWn5vPq72ZHFK3R6qGjvWHWudiRC75tdGzLS4WjvV5QqCKm5f5s4Y3HeFYN5EZaSBhGhvQjFBvKJ";
    const secretKey = bs58.decode(base58PrivateKey);
    const payer = Keypair.fromSecretKey(secretKey);

    const mint = new PublicKey(mintAddress);
    const destination = new PublicKey(destinationAddress);

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

    try {
      const transaction = await burn(
        connection,
        payer,
        destinationTokenAccount.address,
        mint,
        payer,
        burnAmount
      );
      await connection.confirmTransaction(transaction, 'confirmed');
      setTransactionStatus('Burning successful');
    } catch (error) {
      console.error(error);
      setTransactionStatus('Burning failed');
    }
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <h2>Manage Token</h2>
      
      {/* Mint Token */}
      <h3 className="mt-6">Mint Token</h3>
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

      {/* Burn Token */}
      <h3 className="mt-12">Burn Token</h3>
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
        placeholder="Amount to Burn"
        value={burnAmount}
        onChange={(e) => setBurnAmount(Number(e.target.value))}
        className="p-2 m-2 border rounded text-black"
      />
      <button onClick={burnTokens} className="p-4 m-2 bg-red-500 text-white rounded">
        Burn Tokens
      </button>
      
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default ManageToken;
