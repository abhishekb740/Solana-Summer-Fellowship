"use client";
import React, { useState } from 'react';
import { Connection, Keypair, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, setAuthority, AuthorityType } from '@solana/spl-token';
import bs58 from 'bs58';

const DelegateToken = () => {
  const [mintAddress, setMintAddress] = useState<string>('');
  const [sourceAddress, setSourceAddress] = useState<string>('');
  const [delegateAddress, setDelegateAddress] = useState<string>('');
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  const delegateTokens = async () => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      // Replace this with your actual base58-encoded private key
      const base58PrivateKey = "4LYVtZ4wnxqt6AqtSsyzJuHCRSTM6K7QBTgBKCmKREk9y4jAtDjeF262CkfW6KyEGXbt7Ygyajh5jbunaPH32Y6B";
      const secretKey = bs58.decode(base58PrivateKey);
      const payer = Keypair.fromSecretKey(secretKey);

      const mint = new PublicKey(mintAddress);
      const source = new PublicKey(sourceAddress);
      const delegate = new PublicKey(delegateAddress);

      // Get or create the associated token account for the source
      const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        source
      );

      // Delegate authority to another account
      const transaction = await setAuthority(
        connection,
        payer,
        sourceTokenAccount.address,
        payer.publicKey,
        AuthorityType.AccountOwner, // Use AccountOwner for delegation
        delegate
      );
      await connection.confirmTransaction(transaction, 'confirmed');
      setTransactionStatus('Delegation successful');
    } catch (error) {
      console.error(error);
      setTransactionStatus('Delegation failed: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <h2>Delegate Token Authority</h2>
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
        placeholder="Delegate Address"
        value={delegateAddress}
        onChange={(e) => setDelegateAddress(e.target.value)}
        className="p-2 m-2 border rounded text-black"
      />
      <button onClick={delegateTokens} className="p-4 m-2 bg-purple-500 text-white rounded">
        Delegate Tokens
      </button>
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default DelegateToken;
