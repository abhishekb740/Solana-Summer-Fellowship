"use client";
import React, { useState } from 'react';
import { Connection, Keypair, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import bs58 from 'bs58';

const CreateToken = () => {
  const [tokenPublicKey, setTokenPublicKey] = useState<string | null>(null);

  const createToken = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Replace this with your actual base58-encoded private key
    const base58PrivateKey = "4LYVtZ4wnxqt6AqtSsyzJuHCRSTM6K7QBTgBKCmKREk9y4jAtDjeF262CkfW6KyEGXbt7Ygyajh5jbunaPH32Y6B";
    const secretKey = bs58.decode(base58PrivateKey);

    const payer = Keypair.fromSecretKey(secretKey);
    
    const mintAuthority = payer.publicKey;
    const freezeAuthority = payer.publicKey;

    // Create new mint
    const mint = await createMint(
      connection,
      payer, // payer
      mintAuthority, // mint authority
      freezeAuthority, // freeze authority
      9 // decimals
    );

    setTokenPublicKey(mint.toBase58());
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <h2>Create Token</h2>
      <button onClick={createToken} className="p-4 m-2 bg-blue-500 text-white rounded">
        Create Token
      </button>
      {tokenPublicKey && <p>Token Public Key: {tokenPublicKey}</p>}
    </div>
  );
};

export default CreateToken;
