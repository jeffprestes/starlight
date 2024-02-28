require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path:__dirname+'/.env'});
const { BESU_RPC_URL, SEPOLIA_RPC_URL, DEFAULT_PRIVATE_KEY } = process.env;


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: [DEFAULT_PRIVATE_KEY]
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [DEFAULT_PRIVATE_KEY]
    },
    besu: {
      url: BESU_RPC_URL,
      accounts: [DEFAULT_PRIVATE_KEY],
      chainId: 1337,
      timeout: 2000000
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./build"
  },
  etherscan: {
    enabled: false,
  },
  mocha: {
    timeout: 40000
  }
}