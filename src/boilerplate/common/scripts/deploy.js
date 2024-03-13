const hre = require("hardhat");
const fs = require("fs");

require("dotenv").config({ path: __dirname + "/.env" });

function saveMetadata (
  parentDirectory,
  hardhatArtifactPath,
  contractDeployedAddress,
  contractName
  ) {
  const compilationData = fs.readFileSync(parentDirectory + hardhatArtifactPath);
  const abi = JSON.parse(compilationData).abi;
  const tmpData = {
    abi: abi,
    address: contractDeployedAddress,
  };

  const deployedFileName = parentDirectory + "/build/contracts/" + contractName + ".json";
  console.log("Writing", contractName + ".json", " to ", deployedFileName, "...");
  fs.writeFileSync(deployedFileName, JSON.stringify(tmpData));
  console.log(deployedFileName, " written.");
}

async function main() {
  const parentDirectory = __dirname.substring(0, __dirname.lastIndexOf("/"));

  console.log("Reading verification keys...");
  const vkInput = [];
  let vk = [];
  const functionNames = [FUNCTION_NAMES];
  functionNames.forEach((name) => {
    const vkJson = JSON.parse(fs.readFileSync(`./orchestration/common/db/${name}_vk.key`, "utf-8"));
    if (vkJson.scheme) {
      vk = Object.values(vkJson).slice(2).flat(Infinity);
    } else {
      vk = Object.values(vkJson).flat(Infinity);
    }
    vkInput.push(vk);
  });
  console.log("Verification keys read.");

  CUSTOM_CONTRACT_IMPORT
  CUSTOM_PROOF_IMPORT

  console.log("Deploying Verifier...");
  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("Verifier deployed to:", verifierAddress);
  saveMetadata(parentDirectory, "/build/contracts/verify/Verifier.sol/Verifier.json", verifierAddress, "Verifier");

  const CONTRACT_NAME = await hre.ethers.getContractFactory("CONTRACT_NAME");
  const CONTRACT_NAME_instance = await CONTRACT_NAME.deploy(CUSTOM_INPUTS, verifierAddress, vkInput);
  await CONTRACT_NAME_instance.waitForDeployment();
  const CONTRACT_NAME_address = await CONTRACT_NAME_instance.getAddress();
  console.log("CONTRACT_NAME deployed to:", CONTRACT_NAME_address);
  saveMetadata(parentDirectory, "/build/contracts/CONTRACT_NAME/CONTRACT_NAME.sol/CONTRACT_NAME.json", CONTRACT_NAME_address, "CONTRACT_NAME");
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
