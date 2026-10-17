# MSIS 459 — Module 3 Blockchain DApps

## Project Overview

This repository contains two decentralized applications developed for MSIS 459. Both projects demonstrate smart contract development using Solidity, deployment through Hardhat, and blockchain interaction through a React frontend connected to MetaMask.

### Part 1 — Simple Storage DApp

A decentralized application that allows users to store and retrieve text data on a local Ethereum-compatible blockchain.

**Features:**
- Connect a MetaMask wallet
- Store text using a Solidity smart contract
- Retrieve stored blockchain data
- Confirm transactions through MetaMask
- Display wallet connection and transaction status

### Part 2 — TODO List DApp

A decentralized task management application that stores tasks and completion statuses on the blockchain.

**Features:**
- Connect MetaMask to the Hardhat Local network
- Create blockchain-based tasks
- Retrieve and display existing tasks
- Mark tasks complete or incomplete
- Display total and completed task counts
- Refresh blockchain task information

## Technology Stack

- Solidity 0.8.28
- Hardhat 2.29.1
- React 19.3.0
- Ethers.js 6.17.0
- MetaMask
- Node.js
- AWS EC2 Ubuntu

## Architecture

Both applications follow a similar architecture:

React Frontend → MetaMask → Ethers.js → Hardhat Local Blockchain → Solidity Smart Contract

The frontend provides the user interface, MetaMask handles wallet connections and transaction approvals, and the smart contracts manage blockchain data.

## Project Structure

```text
msis459-module3/
├── part1-simple-storage/
│   ├── contracts/
│   ├── scripts/
│   ├── src/
│   └── README.md
├── part2-todo-dapp/
│   ├── contracts/
│   ├── scripts/
│   ├── src/
│   └── README.md
└── README.md
```

## Installation and Deployment

Each project can be installed and deployed independently.

### Install Dependencies

```bash
cd part1-simple-storage
npm install
```

Or:

```bash
cd part2-todo-dapp
npm install
```

### Start Hardhat

```bash
npx hardhat node
```

### Compile Smart Contracts

In a separate terminal:

```bash
npx hardhat compile
```

### Deploy Smart Contracts

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Start React

```bash
npm start
```

Configure MetaMask to use the Hardhat Local network with chain ID `31337` and the appropriate local RPC endpoint.

Update the frontend contract address after deployment if necessary.

## Testing Results

### Part 1

- Solidity contract compiled successfully
- Smart contract deployed to Hardhat
- MetaMask wallet connected successfully
- Blockchain write transaction confirmed
- Stored text retrieved successfully

### Part 2

- Solidity contract compiled successfully
- TODO List contract deployed successfully
- Task creation verified through Hardhat console
- Task retrieval verified
- Task completion toggling verified
- React interface successfully displayed blockchain tasks
- MetaMask transaction approvals demonstrated

Both applications were tested using the local Hardhat blockchain environment.

## Demonstration Videos

Part 1: Simple Storage DApp — Add video link here.

Part 2: TODO List DApp — Add video link here.

## Author

GitHub: [ladavis-dev](https://github.com/ladavis-dev)

Developed for MSIS 459 — Blockchain.
