# Solana CLI Tool

This is a command-line interface (CLI) tool for interacting with the Solana Devnet. It allows you to generate or load a keypair, check the balance of the keypair, request an airdrop of SOL, and send SOL to a recipient address.

## Prerequisites

- Node.js installed (version 12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the source code.

```sh
git clone https://github.com/abhishekb740/Solana-Summer-Fellowship
cd CLI-Tool
```

2. Install the required dependencies.
```sh
npm install
```

3. Make sure the script is executable.
```sh
chmod +x your-cli-script.js
```

## Usage
You can use the CLI tool with different options to perform various operations. The available options are:

-a, --airdrop: Request an airdrop of 1 SOL to the keypair.
-b, --balance: Get the balance of the keypair.
-r, --recipient <address>: Recipient public key address for sending SOL.
-s, --send <amount>: Send the specified amount of SOL to the recipient.

##Examples usage for a transaction:
1. node wallet.js --recipient 5XStL2y7A9jhHQU3qAoFLoYzvipCoqT3ixfg9or8VUaK --send 1.9
Loaded existing keypair. Public key: 3YynBw2VM1WpDr9MzAb5gBToGJ5pPLsCdRT1aYe5Z6UC
Sent 1.9 SOL to 5XStL2y7A9jhHQU3qAoFLoYzvipCoqT3ixfg9or8VUaK
Transaction: https://explorer.solana.com/tx/3ay5KAHZJzjJoM5iyKeAifHGzGEcrJruzjufkrSSx2AGCsUNumabMJMmDYWfdHdsgrWipAfFpnscTP2462f8XUxf?cluster=devnet

