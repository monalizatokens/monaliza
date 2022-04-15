/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;

task(
   "blockNumber",
   "Prints the current block number",
   async (_, { ethers }) => {
     await ethers.provider.getBlockNumber().then((blockNumber) => {
       console.log("Current block number: " + blockNumber);
     });
   }
 );

module.exports = {
   solidity: "0.8.0",
   defaultNetwork: "matic",
   networks: {
      hardhat: {},
      matic: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
         //gas: 2100000, gasPrice: 8000000000
      }
   },
}