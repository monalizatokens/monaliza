//const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
//const HDWalletProvider = require("truffle-hdwallet-provider");

//const mnemonic = require("/secrets/secret.json").secret;
//const RINKEBY_RPC_URL= require("/secrets/secret.json").rinkeby_rpc_url;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = require("./secret.json").secret;
const RINKEBY_RPC_URL= require("./secret.json").rinkeby_rpc_url;
console.log(RINKEBY_RPC_URL);

//const mnemonic = mnemonic;
console.log(mnemonic);

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        //return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/918324bac7924b7ea8bc1f32a9bf3098")
        return new HDWalletProvider(mnemonic, RINKEBY_RPC_URL, 0) 
      },
      network_id: "*",
      chainId: 4,
      skipDryRun: true,
      timeoutBlocks: 200,
      confirmations: 2 
    },
    maticmumbai: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rpc-mumbai.maticvigil.com/v1/8c7e9f0faa20639a2e13c38697d43fb2c3812d40")
        //return new HDWalletProvider(mnemonic, "wss://polygon-mumbai.g.alchemy.com/v2/spanmhhGSA-8chSUSWtbrjq2BPJjVLwa") 
        //return new HDWalletProvider(mnemonic, "https://polygon-mumbai.g.alchemy.com/v2/spanmhhGSA-8chSUSWtbrjq2BPJjVLwa") 
        //return new HDWalletProvider(mnemonic, "https://matic-mumbai--rpc.datahub.figment.io/apikey/16d99b534329b6dab67e8293f8858d42")
      },
      network_id: 80001,
      chainId: 80001,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 9521975,
      gasPrice: 5000000000,
      networkCheckTimeout: 100000

    },
    bsctestnet: {
      networkCheckTimeout: 10000,
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://data-seed-prebsc-2-s3.binance.org:8545")
      },
      network_id: 97,
      confirmations: 1,
      timeoutBlocks: 100000,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: " ^0.8.0"     // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};
