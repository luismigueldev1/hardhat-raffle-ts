import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { ethers } from "ethers"

const BASE_FEE = ethers.utils.parseEther("0.25") //LINK fee
const GAS_PRICE_LINK = 1e9 //LINK per gas

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const networkName = hre.network.name
    const chainId = hre.network.config.chainId!

    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(networkName)) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args,
            log: true,
            waitConfirmations: networkConfig[chainId].waitConfirmations,
        })
        log("Mocks deployed!")
        log("--------------------------------------------")
    }
}

export default func
func.tags = ["all", "mocks"]
