#!/usr/bin/env node

const { program } = require('commander');
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

// Setup commander to handle CLI arguments
program
    .version('1.0.0')
    .description('Solana CLI Tool')
    .option('-r, --recipient <address>', 'Recipient public key address')
    .option('-a, --airdrop', 'Request an airdrop')
    .option('-b, --balance', 'Get balance of the keypair')
    .option('-s, --send <amount>', 'Send specified amount of SOL to recipient', parseFloat).parse(process.argv);

const options = program.opts();

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

const main = async () => {
    await loadOrGenerateKeypair(); // Ensure the keypair is loaded or generated first

    if (options.balance) {
        await getBalance(publicKey); // Fetch balance for the generated keypair
    }

    if (options.airdrop) {
        await getAirdrop(publicKey); // Request an airdrop
    }

    if (options.send !== undefined) {
        await sendSol(keypair, options.recipient, options.send); // Send specified amount of SOL to the recipient
    }
};

main();