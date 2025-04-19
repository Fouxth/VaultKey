import type { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv"

dotenv.config()

const { PRIVATE_KEY, VITE_RPC_URL } = process.env

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    holesky: {
      url: VITE_RPC_URL || "https://ethereum-holesky-rpc.publicnode.com",
      chainId: 17000,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}

export default config
