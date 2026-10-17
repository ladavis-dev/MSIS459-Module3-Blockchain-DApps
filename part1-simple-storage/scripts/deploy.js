const hre = require("hardhat");

async function main() {
  const SimpleStorage = await hre.ethers.getContractFactory(
    "SimpleStorage"
  );

  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.waitForDeployment();

  const contractAddress = await simpleStorage.getAddress();

  console.log("SimpleStorage deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
