import { BigNumberish, ethers } from "ethers"

interface NetworkConfig {
    [networkId: number]: Network
}
interface Network {
    name?: string
    ethUsdPriceAddress?: string
    waitConfirmations: number
    vrfCoordinatorV2Address?: string
    entranceFee?: BigNumberish
    keyHash?: string
    subscriptionId?: string
    callbackGasLimit?: string
    interval?: string
}

const networkConfig: NetworkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
        waitConfirmations: 6,

        //VRFCoordinatorV2
        vrfCoordinatorV2Address: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        entranceFee: ethers.utils.parseEther("0.01"),
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "8618",
        callbackGasLimit: "500000",
        interval: "30",
    },
    31337: {
        name: "hardhat",
        waitConfirmations: 1,

        //VRFCoordinatorV2
        entranceFee: ethers.utils.parseEther("0.01"),
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "0",
        callbackGasLimit: "500000",
        interval: "30",
    },
}

const developmentChains: string[] = ["hardhat", "localhost"]
const devWaitConfirmations = 1

const DECIMALS: number = 8
const INITIAL_ANSWER: number = 120000000000

export { developmentChains, networkConfig, DECIMALS, INITIAL_ANSWER, devWaitConfirmations }
