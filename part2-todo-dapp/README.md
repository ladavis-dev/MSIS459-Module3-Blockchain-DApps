# MSIS 459 – Module 3: TODO List DApp

## Project Overview

This project is a decentralized TODO List application developed for MSIS 459 – Blockchain Technologies, Module 3, Part 2.

The application demonstrates how a React.js frontend can interact with a Solidity smart contract deployed to a local Ethereum blockchain using Hardhat and MetaMask.

Users can create tasks, retrieve existing tasks, and update task completion statuses. Unlike a traditional TODO application that stores information in a centralized database, this application stores task information directly in a blockchain smart contract.

The project was developed and deployed in an AWS EC2 Ubuntu environment, with SSH port forwarding used to access the application and blockchain network from a local computer.

### Project Objectives

- Develop and compile a Solidity smart contract.
- Deploy the contract to a local Hardhat Ethereum blockchain.
- Integrate MetaMask for wallet authentication and transaction authorization.
- Build a React.js frontend for interacting with the smart contract.
- Create and retrieve tasks stored on the blockchain.
- Update task completion statuses through blockchain transactions.
- Verify contract functionality using the Hardhat console and Ethers.js.

## Technology Stack

| Technology | Version / Purpose |
|---|---|
| Solidity | 0.8.28 – Smart contract development |
| Hardhat | 2.29.1 – Local Ethereum blockchain and development |
| Ethers.js | 6.17.0 – Blockchain interaction |
| React.js | 19.3.0 – Frontend user interface |
| MetaMask | Wallet connection and transaction authorization |
| Node.js | JavaScript runtime |
| AWS EC2 | Ubuntu-based development environment |
| Git / GitHub | Source code version control |

## System Architecture

The application uses a three-layer architecture consisting of the frontend, blockchain integration, and smart contract.

```text
                  USER
                   |
                   v
          +------------------+
          | React.js Frontend|
          | localhost:3001   |
          +------------------+
                   |
                   v
          +------------------+
          |     Ethers.js    |
          | Blockchain API   |
          +------------------+
                   |
                   v
          +------------------+
          |     MetaMask     |
          | Wallet / Signing |
          +------------------+
                   |
                   v
          +------------------+
          | Hardhat Network  |
          | Chain ID: 31337  |
          | localhost:8545   |
          +------------------+
                   |
                   v
          +------------------+
          | TodoList.sol     |
          | Smart Contract   |
          +------------------+
                   |
                   v
          +------------------+
          | Blockchain State |
          | Task Information |
          +------------------+
```

### Architecture Components

**1. React.js Frontend**

The frontend provides the interface for managing tasks. Users can connect their MetaMask wallet, create tasks, view stored tasks, and change completion statuses.

**2. Ethers.js**

Ethers.js connects the React application to the Ethereum-compatible blockchain. It provides functionality for reading smart contract data and submitting transactions.

**3. MetaMask**

MetaMask manages the user's blockchain account and authorizes state-changing transactions.

Creating tasks and updating completion statuses require transaction confirmation through MetaMask.

**4. Hardhat Blockchain**

Hardhat provides a local Ethereum development blockchain used for deploying and testing the TodoList smart contract.

Network configuration:

- Network Name: Hardhat Local
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: ETH

**5. Solidity Smart Contract**

The `TodoList.sol` smart contract manages task information and provides functions for creating tasks, retrieving tasks, and toggling completion statuses.

Task information is maintained within the smart contract's blockchain state.

## Project Directory Structure

```text
msis459-module3/
|
+-- part1-simple-storage/
|   +-- contracts/
|   +-- scripts/
|   +-- src/
|
+-- part2-todo-dapp/
    |
    +-- contracts/
    |   +-- TodoList.sol
    |
    +-- scripts/
    |   +-- deploy.js
    |
    +-- src/
    |   +-- App.js
    |   +-- App.css
    |   +-- index.js
    |   +-- index.css
    |
    +-- public/
    |
    +-- test/
    |
    +-- hardhat.config.js
    +-- package.json
    +-- package-lock.json
    +-- README.md
```

The Part 2 application was created by copying the working Part 1 project environment and replacing the SimpleStorage contract with the TodoList implementation.

## Application Features

### 1. MetaMask Wallet Connection

Users connect their Ethereum wallet through MetaMask.

The application displays the connected wallet address and verifies that the selected network is Hardhat Local.

### 2. Create New Tasks

Users enter a task description and select **Add Task**.

The application submits a transaction to the TodoList smart contract.

MetaMask prompts the user to approve the transaction before it is broadcast to the blockchain.

### 3. Retrieve Blockchain Tasks

The application retrieves tasks stored in the smart contract and displays them in the React interface.

Each task includes:

- Task identifier
- Task description
- Completion status

### 4. Update Task Completion

Users can select **Mark Complete** or **Mark Incomplete**.

This operation updates the task's completion status through a blockchain transaction.

### 5. Task Statistics

The frontend displays the total number of tasks and the number of completed tasks.

### 6. Refresh Blockchain Data

The **Refresh Tasks** button retrieves current task information from the blockchain.

### 7. Transaction Authorization

MetaMask requires confirmation before state-changing blockchain transactions are submitted.

This demonstrates the difference between read-only smart contract calls and transactions that modify blockchain state.

## Installation Instructions

### Prerequisites

The following tools are required:

- Node.js and npm
- Git
- MetaMask browser extension
- Ubuntu/Linux development environment
- Hardhat-compatible Ethereum development tools

### Step 1: Navigate to the Project

```bash
cd ~/msis459-module3/part2-todo-dapp
```

If cloning the project from GitHub:

```bash
git clone <REPOSITORY_URL>

cd msis459-module3/part2-todo-dapp
```

Replace `<REPOSITORY_URL>` with the actual repository URL.

### Step 2: Install Dependencies

```bash
npm install
```

The project uses the following primary dependencies:

```text
hardhat@2.29.1
ethers@6.17.0
react@19.3.0
@nomicfoundation/hardhat-toolbox
react-scripts
```

Verify the installed versions:

```bash
npm list hardhat ethers react --depth=0
```

### Step 3: Compile the Smart Contract

```bash
npx hardhat compile
```

Successful compilation was confirmed during development:

```text
Compiled 1 Solidity file successfully
(evm target: paris).
```

## Blockchain Deployment Instructions

### Step 1: Start the Hardhat Blockchain

From the project directory:

```bash
npx hardhat node
```

Hardhat starts a local Ethereum blockchain and generates development accounts with test ETH.

The default JSON-RPC endpoint is:

```text
http://127.0.0.1:8545
```

**Important:** Hardhat development accounts and private keys are publicly known and must never be used to hold real cryptocurrency.

Keep this terminal running.

### Step 2: Deploy the TodoList Contract

Open a second terminal and navigate to the project directory:

```bash
cd ~/msis459-module3/part2-todo-dapp
```

Execute:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Successful deployment output:

```text
Deploying TodoList contract...

TodoList deployed to:
0xe7f1725E7734cE288F8367e1Bb143E90bb3F0512

Network: localhost
```

This address identifies the TodoList contract deployed during the verified development session.

**Note:** Contract addresses may change when deploying to a new blockchain instance. Update the frontend contract address whenever the deployment changes.

### Step 3: Configure MetaMask

Add the local Hardhat network to MetaMask.

| Setting | Value |
|---|---|
| Network Name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency Symbol | ETH |

Import one of the development accounts generated by Hardhat.

Only use the generated private keys for local testing.

### Step 4: Start the React Frontend

In a separate terminal:

```bash
cd ~/msis459-module3/part2-todo-dapp
```

Run:

```bash
PORT=3001 npm start
```

Open the application at:

```text
http://localhost:3001
```

### Step 5: Access the Application Through SSH Port Forwarding

The application was developed on an AWS EC2 Ubuntu instance and accessed from a local MacBook using SSH port forwarding.

Example:

```bash
ssh -i ~/.ssh/ms419-ec2-key.pem \
  -L 8545:127.0.0.1:8545 \
  -L 3001:127.0.0.1:3001 \
  ubuntu@<EC2_PUBLIC_IP>
```

Replace the SSH key filename and EC2 address with the correct values for your environment.

Port forwarding provides local access to:

- React frontend: `http://localhost:3001`
- Hardhat JSON-RPC: `http://localhost:8545`

The Hardhat RPC port should not be publicly exposed to the internet.

## Smart Contract Testing

Testing was performed using the Hardhat console, Ethers.js, and the React frontend.

### Test 1: Connect to the Deployed Contract

Start the Hardhat console:

```bash
npx hardhat console --network localhost
```

Initialize the contract using its deployment address:

```javascript
var todoAddress =
  "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

var todoFixed = await ethers.getContractAt(
  "TodoList",
  todoAddress
);
```

The lowercase address was used to avoid an EIP-55 mixed-case checksum validation error encountered during initial testing.

**Result:** Contract initialization successful.

### Test 2: Verify Task Count

Execute:

```javascript
(await todoFixed.taskCount()).toString()
```

Observed output:

```text
'3'
```

**Result: PASSED**

The smart contract successfully reported three stored tasks.

### Test 3: Retrieve a Blockchain Task

Execute:

```javascript
await todoFixed.getTask(3)
```

Observed output:

```text
Result(3) [
  3n,
  'One Final Test',
  false
]
```

**Result: PASSED**

The contract successfully returned the third task, including its identifier, description, and completion status.

### Test 4: Verify Deployed Contract Bytecode

Execute:

```javascript
const code = await ethers.provider.getCode(todoAddress);

console.log(code !== "0x");
```

Observed output:

```text
true
```

**Result: PASSED**

This confirms that contract bytecode exists at the specified blockchain address.

### Test 5: Estimate Gas for Task Completion

Execute:

```javascript
(
  await todoFixed.toggleCompleted.estimateGas(3)
).toString()
```

Observed output:

```text
'47896'
```

**Result: PASSED**

The Hardhat provider successfully estimated 47,896 gas for toggling the completion status of Task #3.

This test does not submit a transaction or modify blockchain state.

### Test 6: Frontend Task Creation

Testing steps:

1. Connect MetaMask to the React application.
2. Enter a new task description.
3. Select **Add Task**.
4. Confirm the transaction through MetaMask.
5. Verify that the new task appears in the task list.

**Result: PASSED**

Tasks were successfully created through the React interface and stored on the blockchain.

### Test 7: Frontend Task Completion

Testing steps:

1. Locate an incomplete task.
2. Select **Mark Complete**.
3. Approve the MetaMask transaction.
4. Verify the updated completion status.
5. Select **Mark Incomplete** to reverse the status.

**Result: PASSED**

The application successfully updated task completion statuses through blockchain transactions.

### Testing Results Summary

| Test | Result |
|---|---|
| Solidity contract compilation | Passed |
| Hardhat contract deployment | Passed |
| MetaMask wallet connection | Passed |
| React frontend integration | Passed |
| Create new task | Passed |
| Retrieve stored tasks | Passed |
| Toggle task completion | Passed |
| Verify task count | Passed |
| Verify contract bytecode | Passed |
| Estimate transaction gas | Passed |

These results represent the manual development and integration tests performed during the project. They do not constitute a comprehensive automated security test suite.

## Implementation Challenges and Troubleshooting

### 1. MetaMask and Hardhat Connectivity

The React application initially encountered difficulties connecting to the local Hardhat network.

The development environment used an AWS EC2 instance, while MetaMask was running in a browser on the local computer.

**Resolution:**

SSH port forwarding was configured to expose the remote Hardhat RPC endpoint through the local machine.

The network was verified using:

```bash
curl -s http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

Expected result:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x7a69"
}
```

The hexadecimal value `0x7a69` corresponds to Hardhat chain ID 31337.

### 2. Incorrect Hardhat Project Directory

During testing, the Hardhat console was initially opened from the Part 1 SimpleStorage directory.

This caused the following error:

```text
HH700: Artifact for contract "TodoList" not found.
```

**Resolution:**

The console was restarted from:

```bash
cd ~/msis459-module3/part2-todo-dapp
```

This ensured that Hardhat loaded the correct compiled contract artifacts.

### 3. Ethereum Address Checksum Validation

Ethers.js initially rejected the contract address with:

```text
TypeError: bad address checksum
code: INVALID_ARGUMENT
```

**Resolution:**

The deployed contract address was supplied in lowercase format.

After correcting the address, contract calls successfully retrieved the task count and task information.

### 4. Transaction Revert Messages

During frontend testing, the Hardhat terminal displayed messages such as:

```text
Error: Transaction reverted without a reason
```

These messages appeared during some transaction preparation and confirmation workflows.

Despite these messages, subsequent confirmed transactions successfully created tasks and updated task completion statuses.

A later gas estimation test for `toggleCompleted(3)` also completed successfully.

**Status:**

The core functionality was verified, but the exact cause of the earlier revert messages was not conclusively determined. Additional investigation of transaction simulation, gas estimation, and transaction receipts would be required to establish the cause.

### 5. Smart Contract State and Frontend Synchronization

The application retrieves blockchain task information through Ethers.js.

After transactions are confirmed, the frontend can refresh its task list to display the current blockchain state.

This demonstrates the importance of synchronizing a decentralized frontend with the underlying smart contract.

## Security Considerations

The application is intended for educational development and testing.

Important considerations include:

- Hardhat accounts contain publicly known development private keys.
- No real ETH should be transferred to Hardhat test accounts.
- Smart contract transactions require wallet authorization.
- Smart contract data is visible to participants with access to the blockchain.
- Task descriptions should not contain passwords, private keys, or sensitive information.
- Development RPC endpoints should not be exposed publicly.
- The application has not undergone a formal smart contract security audit.

For production deployment, additional security testing, access controls, error handling, and deployment safeguards would be required.

## Project Results

The project successfully demonstrated a functional decentralized TODO List application using Solidity, Hardhat, React.js, Ethers.js, and MetaMask.

The application supports creating tasks, retrieving blockchain data, and updating task completion statuses through Ethereum-compatible transactions.

The implementation also demonstrated practical blockchain development concepts, including smart contract deployment, wallet integration, transaction authorization, gas estimation, and blockchain state management.

Testing confirmed that the deployed contract stored three tasks and that the React application could interact with the contract.

## Conclusion

This assignment provided practical experience integrating smart contracts with a web-based frontend.

One of the most important lessons was understanding how the React application, MetaMask wallet, Ethers.js library, and Hardhat blockchain interact.

The project also highlighted common development challenges, including blockchain connectivity, contract artifact management, Ethereum address validation, and transaction troubleshooting.

Overall, the implementation demonstrates the basic architecture and functionality of a decentralized application and provides a foundation for more advanced blockchain-based systems.

---

**Course:** MSIS 459 – Blockchain Technologies  
**Assignment:** Module 3 – Part 2: TODO List DApp  
**Development Environment:** AWS EC2 Ubuntu / Hardhat Local Blockchain  
**Technologies:** Solidity, Hardhat, React.js, Ethers.js, MetaMask  
**Author:** Lateef Davis
