const hre = require("hardhat");

async function main() {
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy();

  await productRegistry.deployed();

  console.log("ProductRegistry deployed to:", productRegistry.address);
  
  // Save the contract address to a file for frontend use
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ ProductRegistry: productRegistry.address }, undefined, 2)
  );
  
  const ProductRegistryArtifact = artifacts.readArtifactSync("ProductRegistry");
  fs.writeFileSync(
    contractsDir + "/ProductRegistry.json",
    JSON.stringify(ProductRegistryArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 