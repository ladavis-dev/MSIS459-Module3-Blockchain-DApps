
const hre = require("hardhat");

async function main() {
  const TodoList = await hre.ethers.getContractFactory("TodoList");

  console.log("Deploying TodoList contract...");

  const todoList = await TodoList.deploy();

  await todoList.waitForDeployment();

  const contractAddress = await todoList.getAddress();

  console.log("TodoList deployed to:", contractAddress);
  console.log("Network:", hre.network.name);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
