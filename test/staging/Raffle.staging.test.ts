import { assert, expect } from "chai"
import { BigNumber } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { Raffle } from "../../typechain-types"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging test", () => {
          let raffle: Raffle
          let raffleEntranceFee: BigNumber
          let deployer: string

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", () => {
              it("works with live Chainlink Keeperes and Chainlink VRF, we get a random winner", async () => {
                  //enter the raffle
                  const startingTimestamp = await raffle.getLatestTimestamp()
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")

                          try {
                              //add our asserts here
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimestamp = await raffle.getLatestTimestamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState.toString(), "0")
                              //   assert.equal(
                              //       winnerEndingBalance.toString(),
                              //       winnerStartingBalance.add(raffleEntranceFee).toString()
                              //   )
                              assert(endingTimestamp > startingTimestamp)
                              resolve("")
                          } catch (error) {
                              reject(error)
                          }
                      })
                      //Then entering the raffle
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(1)
                      //const winnerStartingBalance = await accounts[0].getBalance()
                  })
              })
          })
      })
