
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const ABI = [
  "function taskCount() view returns (uint256)",
  "function getTask(uint256 id) view returns (uint256, string, bool)",
  "function createTask(string memory content)",
  "function toggleCompleted(uint256 id)"
];

const HARDHAT_CHAIN_ID = 31337n;
const HARDHAT_CHAIN_HEX = "0x7a69";

function App() {
  const [account, setAccount] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);

  const getEthereumProvider = useCallback(() => {
    if (!window.ethereum) {
      throw new Error(
        "No Ethereum wallet detected. Please install MetaMask."
      );
    }

    const injected = window.ethereum;

    if (Array.isArray(injected.providers)) {
      const metamask = injected.providers.find(
        (provider) => provider.isMetaMask
      );

      if (metamask) {
        return metamask;
      }
    }

    return injected;
  }, []);

  const getProvider = useCallback(async () => {
    const ethereum = getEthereumProvider();
    const provider = new ethers.BrowserProvider(ethereum);

    const chainId = await ethereum.request({
      method: "eth_chainId"
    });

    if (chainId.toLowerCase() !== HARDHAT_CHAIN_HEX) {
      throw new Error(
        "Wrong network. Select Hardhat Local (31337) in MetaMask."
      );
    }

    const network = await provider.getNetwork();

    if (network.chainId !== HARDHAT_CHAIN_ID) {
      throw new Error("Incorrect blockchain network.");
    }

    return provider;
  }, [getEthereumProvider]);

  const getContract = useCallback(
    async (write = false) => {
      const provider = await getProvider();

      const code = await provider.getCode(CONTRACT_ADDRESS);

      if (code === "0x") {
        throw new Error(
          "TodoList contract not found. Check your Hardhat deployment."
        );
      }

      if (write) {
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
    },
    [getProvider]
  );

  const loadTasks = useCallback(async () => {
    setBusy(true);

    try {
      setStatus("Loading blockchain tasks...");

      const contract = await getContract();
      const count = await contract.taskCount();

      const loadedTasks = [];

      for (let i = 1n; i <= count; i++) {
        const task = await contract.getTask(i);

        loadedTasks.push({
          id: task[0].toString(),
          content: task[1],
          completed: task[2]
        });
      }

      setTasks(loadedTasks);
      setStatus("Tasks loaded successfully");
    } catch (error) {
      console.error("Task loading error:", error);

      setStatus(
        error.shortMessage ||
        error.message ||
        "Unable to load tasks"
      );
    } finally {
      setBusy(false);
    }
  }, [getContract]);

  async function connectWallet() {
    setBusy(true);

    try {
      setStatus("Connecting to MetaMask...");

      const ethereum = getEthereumProvider();

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No wallet account authorized.");
      }

      const provider = await getProvider();
      const signer = await provider.getSigner();

      const address = await signer.getAddress();

      setAccount(address);
      setStatus("Wallet connected successfully");
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

  async function createTask(event) {
    event.preventDefault();

    if (!newTask.trim()) {
      setStatus("Please enter a task.");
      return;
    }

    if (!account) {
      setStatus("Connect MetaMask before creating tasks.");
      return;
    }

    setBusy(true);

    try {
      setStatus("Waiting for MetaMask approval...");

      const contract = await getContract(true);
      const tx = await contract.createTask(newTask.trim());

      setStatus("Transaction submitted. Waiting for confirmation...");

      await tx.wait();

      setNewTask("");
      setStatus("Task created successfully");
    } catch (error) {
      console.error("Create task error:", error);

      setStatus(
        error.shortMessage ||
        error.message ||
        "Unable to create task"
      );
      setBusy(false);
      return;
    }

    await loadTasks();
  }

  async function toggleTask(id) {
    if (!account) {
      setStatus("Connect MetaMask before updating tasks.");
      return;
    }

    setBusy(true);

    try {
      setStatus("Waiting for MetaMask approval...");

      const contract = await getContract(true);
      const tx = await contract.toggleCompleted(id);

      setStatus("Waiting for transaction confirmation...");

      await tx.wait();

      setStatus("Task completion updated");
    } catch (error) {
      console.error("Toggle task error:", error);

      setStatus(
        error.shortMessage ||
        error.message ||
        "Unable to update task"
      );
      setBusy(false);
      return;
    }

    await loadTasks();
  }

  useEffect(() => {
    let ethereum;

    try {
      ethereum = getEthereumProvider();
    } catch (error) {
      return;
    }

    function handleAccountsChanged(accounts) {
      setAccount(accounts.length ? accounts[0] : "");
      setStatus("MetaMask account changed");
    }

    function handleChainChanged(chainId) {
      setAccount("");
      setTasks([]);

      if (chainId.toLowerCase() === HARDHAT_CHAIN_HEX) {
        setStatus("Hardhat Local selected. Connect MetaMask.");
      } else {
        setStatus("Wrong network. Select Hardhat Local.");
      }
    }

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

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
  }, [getEthereumProvider]);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="App">
      <main className="app-container">
        <header className="app-header">
          <h1>MSIS 459 - TODO List DApp</h1>
          <p>Decentralized Task Management</p>
          <span className="technology">
            Solidity + Hardhat + React + MetaMask
          </span>
        </header>

        <section className="wallet-section">
          <div>
            <h2>Wallet Connection</h2>
            <p>
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Not connected"}
            </p>
          </div>

          <button
            onClick={connectWallet}
            disabled={busy}
          >
            {account ? "Reconnect Wallet" : "Connect MetaMask"}
          </button>
        </section>

        <section className="task-section">
          <h2>Create New Task</h2>

          <form onSubmit={createTask} className="task-form">
            <input
              type="text"
              value={newTask}
              onChange={(event) =>
                setNewTask(event.target.value)
              }
              placeholder="Enter a task..."
              disabled={busy}
            />

            <button
              type="submit"
              disabled={busy || !account}
            >
              Add Task
            </button>
          </form>
        </section>

        <section className="task-section">
          <div className="task-heading">
            <h2>Blockchain Tasks</h2>

            <button
              onClick={loadTasks}
              disabled={busy}
            >
              Refresh Tasks
            </button>
          </div>

          <p className="task-summary">
            Total: {tasks.length} | Completed: {completedCount}
          </p>

          {tasks.length === 0 ? (
            <p className="empty-message">
              No tasks loaded. Create a task or refresh.
            </p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  <div className="task-info">
                    <span className="task-id">
                      #{task.id}
                    </span>

                    <span className="task-content">
                      {task.content}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleTask(task.id)}
                    disabled={busy || !account}
                  >
                    {task.completed
                      ? "Mark Incomplete"
                      : "Mark Complete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="status-section">
          <p>Status: {status}</p>
          <p>Network: Hardhat Local (31337)</p>
          <p className="contract-address">
            Contract: {CONTRACT_ADDRESS}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
