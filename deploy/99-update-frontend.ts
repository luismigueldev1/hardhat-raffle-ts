import { ethers, network } from "hardhat"

import fs from "fs"

const FRONTEND_ADRESSES_FILE = "../nextjs-raffle-ts/constants/contractAddress.json"
const FRONTEND_ABI_FILE = "../nextjs-raffle-ts/constants/abi.json"

const func = async () => {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        updateContractAdresses()
        updateAbi()
    }
}

const updateContractAdresses = async () => {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId!.toString()
    const currentAddresses = JSON.parse(fs.readFileSync(FRONTEND_ADRESSES_FILE, "utf8"))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address)
        }
    } else {
        currentAddresses[chainId] = [raffle.address]
    }

    fs.writeFileSync(FRONTEND_ADRESSES_FILE, JSON.stringify(currentAddresses))
}

const updateAbi = async () => {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(
        FRONTEND_ABI_FILE,
        raffle.interface.format(ethers.utils.FormatTypes.json).toString()
    )
}

export default func
func.tags = ["all", "frontend"]
