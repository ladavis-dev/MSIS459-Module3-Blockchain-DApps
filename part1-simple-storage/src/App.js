
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
  "function get() view returns (string)",
  "function set(string myText)",
  "event myEventTest(string eventOutput)"
];

const HARDHAT_CHAIN_ID = 31337n;
const HARDHAT_CHAIN_HEX = "0x7a69";

function App() {
  const [account, setAccount] = useState("");
  const [storedData, setStoredData] = useState("");
  const [newData, setNewData] = useState("");
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);

  // Identify the injected MetaMask provider.
  function getEthereumProvider() {
    if (!window.ethereum) {
      throw new Error(
        "No Ethereum wallet detected. Please install MetaMask."
      );
    }

    const injected = window.ethereum;

    console.log("Window Ethereum provider:", injected);
    console.log("MetaMask detected:", injected.isMetaMask);
    console.log("Injected providers:", injected.providers);

    if (Array.isArray(injected.providers)) {
      const metamask = injected.providers.find(
        (provider) => provider.isMetaMask
      );

      if (metamask) {
        console.log("Selected MetaMask provider");
        return metamask;
      }
    }

    return injected;
  }

  // Create provider and verify Hardhat network.
  async function getProvider() {
    const ethereum = getEthereumProvider();

    const provider = new ethers.BrowserProvider(ethereum);

    const rawChainId = await ethereum.request({
      method: "eth_chainId"
    });

    const network = await provider.getNetwork();

    console.log("=== BLOCKCHAIN DIAGNOSTICS ===");
    console.log("Raw chain ID:", rawChainId);
    console.log(
      "Detected chain ID:",
      network.chainId.toString()
    );
    console.log(
      "Expected chain ID:",
      HARDHAT_CHAIN_ID.toString()
    );
    console.log(
      "MetaMask provider:",
      ethereum.isMetaMask
    );
    console.log("==============================");

    if (network.chainId !== HARDHAT_CHAIN_ID) {
      throw new Error(
        `Wrong network detected (${network.chainId}). ` +
        "Please select Hardhat Local (31337) in MetaMask."
      );
    }

    return provider;
  }

  // Connect MetaMask wallet.
  async function connectWallet() {
    setBusy(true);

    try {
      setStatus("Connecting to MetaMask...");

      const ethereum = getEthereumProvider();

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      if (!accounts || accounts.length === 0) {
        throw new Error(
          "No MetaMask account was authorized."
        );
      }

      const provider = await getProvider();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setStatus("Wallet connected successfully");

      console.log("Connected wallet:", address);
    } catch (error) {
      console.error("Wallet connection error:", error);

      setAccount("");
      setStatus(
        error.shortMessage ||
        error.message ||
        "Wallet connection failed"
      );
    } finally {
      setBusy(false);
    }
  }

  // Get deployed SimpleStorage contract.
  async function getContract(write = false) {
    const provider = await getProvider();

    const code = await provider.getCode(
      CONTRACT_ADDRESS
    );

    console.log("Contract address:", CONTRACT_ADDRESS);
    console.log("Contract bytecode:", code);

    if (code === "0x") {
      throw new Error(
        "Contract not found at the configured address. " +
        "Check your Hardhat deployment."
      );
    }

    if (write) {
      if (!account) {
        throw new Error(
          "Please connect MetaMask before writing."
        );
      }

      const signer = await provider.getSigner();

      return new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );
    }

    return new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      provider
    );
  }

  // Read stored blockchain data.
  async function readData() {
    setBusy(true);

    try {
      setStatus("Reading blockchain data...");

      const contract = await getContract();
      const value = await contract.get();

      console.log("Stored blockchain value:", value);

      setStoredData(value);
      setStatus("Blockchain read successful");
    } catch (error) {
      console.error("Blockchain read error:", error);

      setStatus(
        error.shortMessage ||
        error.message ||
        "Blockchain read failed"
      );
    } finally {
      setBusy(false);
    }
  }

  // Write new data to the blockchain.
  async function writeData() {
    if (!newData.trim()) {
      setStatus("Please enter data to store.");
      return;
    }

    if (!account) {
      setStatus(
        "Please connect MetaMask before writing."
      );
      return;
    }

    setBusy(true);

    try {
      setStatus("Waiting for MetaMask approval...");

      const contract = await getContract(true);

      const tx = await contract.set(newData);

      console.log("Transaction hash:", tx.hash);

      setStatus(
        "Transaction submitted. Waiting for confirmation..."
      );

      const receipt = await tx.wait();

      console.log("Transaction receipt:", receipt);

      const value = await contract.get();

      setStoredData(value);
      setNewData("");

      setStatus("Transaction confirmed successfully");
    } catch (error) {
      console.error("Blockchain write error:", error);

      setStatus(
        error.shortMessage ||
        error.message ||
        "Blockchain write failed"
      );
    } finally {
      setBusy(false);
    }
  }

  // Handle account and network changes.
  useEffect(() => {
    let ethereum;

    try {
      ethereum = getEthereumProvider();
    } catch (error) {
      console.log(error.message);
      return;
    }

    function handleAccountsChanged(accounts) {
      console.log("Accounts changed:", accounts);

      if (accounts.length === 0) {
        setAccount("");
        setStatus("MetaMask disconnected");
      } else {
        setAccount(accounts[0]);
        setStatus("MetaMask account changed");
      }
    }

    function handleChainChanged(chainId) {
      console.log("Network changed:", chainId);

      setAccount("");
      setStoredData("");

      if (
        chainId.toLowerCase() === HARDHAT_CHAIN_HEX
      ) {
        setStatus(
          "Hardhat Local selected. Please connect MetaMask."
        );
      } else {
        setStatus(
          `Wrong network (${chainId}). ` +
          `Select Hardhat Local (${HARDHAT_CHAIN_HEX}).`
        );
      }
    }

    ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    ethereum.on(
      "chainChanged",
      handleChainChanged
    );

    return () => {
      ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );

      ethereum.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>MSIS 459 - Simple Storage DApp</h1>

        <p>Hardhat + React + MetaMask</p>

        <button
          onClick={connectWallet}
          disabled={busy}
        >
          {account
            ? "Reconnect MetaMask"
            : "Connect MetaMask"}
        </button>

        <p>
          Wallet:{" "}
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Not connected"}
        </p>

        <button
          onClick={readData}
          disabled={busy}
        >
          Read Blockchain Data
        </button>

        <h2>
          Stored Data: {storedData || "(empty)"}
        </h2>

        <input
          type="text"
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
          placeholder="Enter blockchain data"
          disabled={busy}
        />

        <button
          onClick={writeData}
          disabled={busy || !account}
        >
          Write to Blockchain
        </button>

        <p>Status: {status}</p>
      </header>
    </div>
  );
}

export default App;
