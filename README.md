# monaliza

To run:  
node server.js
  

To deploy solidity contract:
https://ethereum.org/hr/developers/tutorials/how-to-mint-an-nft/  
npx hardhat compile  
npx hardhat run scripts/deploy.js --network matic  

On linux, run "apt  install ffmpeg" for ffmpeg

Domain SSL installation steps are here   
https://support.comodo.com/index.php?/Knowledgebase/Article/View/1141/37/certificate-installation--nodejs-in-linux   
  
old
1. Run command "truffle migrate --network rinkeby"
2. Run http://localhost:4000/deploynft
Note down NFT contract address
3. Now you can mint NFT at http://localhost:4000/create.html
