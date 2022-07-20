import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction, DeployResult } from "hardhat-deploy/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { VRFCoordinatorV2Mock } from "../typechain-types"

import { verify } from "../utils/verify"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const networkName = hre.network.name
    const chainId = hre.network.config.chainId!

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(networkName)) {
        const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock = await hre.ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events![0].args!.subId

        const VRF_SUB_FUND_AMOUNT = hre.ethers.utils.parseEther("30")
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2Address
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    //vrfCoordinatorV2Address contructor args
    const entranceFee = networkConfig[chainId].entranceFee
    const keyHash = networkConfig[chainId].keyHash
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const interval = networkConfig[chainId].interval

    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        keyHash,
        subscriptionId,
        callbackGasLimit,
        interval,
    ]
    const raffle: DeployResult = await deploy("Raffle", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: networkConfig[chainId].waitConfirmations,
    })

    //Verify contract

    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

    if (!developmentChains.includes(networkName) && ETHERSCAN_API_KEY) {
        log("Verfying...")
        await verify(raffle.address, args)
        log("-----------------------------------------------")
    }
}

export default func
func.tags = ["all", "raffle"]
