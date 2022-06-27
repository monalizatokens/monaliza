# Monaliza: Web3 NFT Infrastructure Platform

To run:  
npm install -g pm2
pm2 link hawzioi6e7ht83h ki00axsbd0ew7em
pm2 start server.js 
Monitor at https://app.pm2.io/bucket/61d4868f06892910a79d73a4/backend/overview/servers
Details here https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04   

  

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
