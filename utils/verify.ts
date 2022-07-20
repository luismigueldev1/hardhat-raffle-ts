import { run } from "hardhat"

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying Contract...")

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error: any) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(error)
        }
    }
}

export { verify }
