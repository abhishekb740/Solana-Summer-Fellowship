#!/usr/bin/env node

const {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction
} = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Create a connection to the Solana Devnet cluster
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

let keypair;
let publicKey;

// Load or generate keypair and print the public key
const loadOrGenerateKeypair = async () => {
    const keypairPath = path.resolve(__dirname, 'keypair.json');
    if (fs.existsSync(keypairPath)) {
        // Load the existing keypair
        const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(keypairPath)));
        keypair = Keypair.fromSecretKey(secretKey);
        publicKey = keypair.publicKey.toBase58();
        console.log(`Loaded existing keypair. Public key: ${publicKey}`);
    } else {
        // Generate a new keypair
        keypair = Keypair.generate();
        publicKey = keypair.publicKey.toBase58();
        console.log(`Generated new keypair. Public key: ${publicKey}`);

        // Save the keypair to a file
        fs.writeFileSync(keypairPath, JSON.stringify(Array.from(keypair.secretKey)));
    }
};

// Request an airdrop of SOL to the public key
const getAirdrop = async (publicKey) => {
    try {
        const airdropSignature = await connection.requestAirdrop(new PublicKey(publicKey), LAMPORTS_PER_SOL);
        console.log(`txhash: ${airdropSignature}`);
        await connection.confirmTransaction(airdropSignature);
        await getBalance(publicKey);
    } catch (error) {
        if (error.message.includes("429 Too Many Requests")) {
            console.error("Airdrop rate limit exceeded. Please wait and try again later.");
        } else {
            console.error("Failed to get airdrop:", error);
        }
    }
};

// Get the balance of the public key
const getBalance = async (publicKey) => {
    try {
        const balanceInLamports = await connection.getBalance(new PublicKey(publicKey));
        const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
        console.log(`Balance: ${balanceInSOL} SOL`);
    } catch (error) {
        console.error("Failed to get balance:", error);
    }
};

// Send SOL to a recipient address
const sendSol = async (keypair, recipient, amountSol) => {
    try {
        const recipientKey = new PublicKey(recipient);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: recipientKey,
                lamports: amountSol * LAMPORTS_PER_SOL,
            })
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`Sent ${amountSol} SOL to ${recipient}`);
        console.log(`Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (error) {
        console.error("Failed to send SOL:", error);
    }
};

// Main function to run the CLI commands
const main = async () => {
    await loadOrGenerateKeypair(); // Ensure the keypair is loaded or generated first
    await getBalance(publicKey); // Fetch balance for the generated keypair
    // await getAirdrop(publicKey); // Request an airdrop
    const recipientPublicKey = '5XStL2y7A9jhHQU3qAoFLoYzvipCoqT3ixfg9or8VUaK'; // Replace with actual recipient public key
    await sendSol(keypair, recipientPublicKey, 0.5); // Send 0.1 SOL to the recipient
};

main();
