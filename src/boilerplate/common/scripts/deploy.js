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
  const functionNames = ["deposit", "transfer", "withdraw", "joinCommitments"];
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

  
  console.log("Deploying Verifier...");
  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("Verifier deployed to:", verifierAddress);
  saveMetadata(parentDirectory, "/build/contracts/verify/Verifier.sol/Verifier.json", verifierAddress, "Verifier");

  
  console.log("Deploying EscrowShield ...");
  const EscrowShield = await hre.ethers.getContractFactory("EscrowShield");
  const escrowShield = await EscrowShield.deploy(realTokenizedAddress, verifierAddress, vkInput);
  await escrowShield.waitForDeployment();
  const escrowShieldAddress = await escrowShield.getAddress();
  console.log("EscrowShield deployed to:", escrowShieldAddress);
  saveMetadata( parentDirectory, 
                "/build/contracts/EscrowShield.sol/EscrowShield.json", 
                escrowShieldAddress, 
                "EscrowShield"
              );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
