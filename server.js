process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('whoops! there was an error');
 });

//var TruffleContract = require("@truffle/contract");
let MonalizaArtifact = require("./build/contracts/MonalizaFactory.json");
let MonalizaNFTArtifact = require("./build/contracts/Monaliza.json");

//const HDWalletProvider = require("@truffle/hdwallet-provider");
const bodyParser = require('body-parser')
const request = require('request').defaults({rejectUnauthorized:false});
const https = require('https');
const pinataSDK = require('@pinata/sdk');
const morgan = require('morgan');
const multer = require('multer');
//const JSONdb = require('simple-json-db');
const csv = require('csv-parser')
const base64 = require('js-base64').Base64;

//const db = new JSONdb('database.json', {});
const ffmpeg = require('ffmpeg-static');
console.log(ffmpeg);
const genThumbnail = require('simple-thumbnail');
const ethSigUtil = require("@metamask/eth-sig-util");

require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
console.log(API_URL)
//const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
//const alchemyWeb3 = createAlchemyWeb3(API_URL)
const { ethers } = require("hardhat");
const { MongoClient } = require('mongodb');

//const ethers = require("@nomiclabs/hardhat-ethers");
const url = 'mongodb://' + require("./secret.json").mongo_db_user + ":" + require("./secret.json").mongo_db_pwd + "@" +  require("./secret.json").mongo_db_ip +':27017';
const client = new MongoClient(url);
const dbName = 'monaliza';

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var proxy = require('express-http-proxy');
var httpProxy = require('http-proxy');

/*async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('all');
  
    // the following code examples can be pasted here...
  
    return 'done.';
  }
  
  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());*/

var allAssets = [];

/*const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };*/
  const options = {
    key: fs.readFileSync('./certs/monaliza.key'),
    cert: fs.readFileSync('./certs/STAR_monaliza_app.crt'),
    ca: [
          fs.readFileSync('./certs/SectigoRSADomainValidationSecureServerCA.crt'),
          fs.readFileSync('./certs/USERTrustRSAAAACA.crt')
       ]
  };



/*console.log(db.get('assets'));*/
//allAssets.push({
//    "a": "b"
    /*"assetContractID": value.receipt.rawLogs[0].address,
    "assetName": req.body.assetName,
    "assetType": "ERC721",
    "creatorAddress": req.body.creatorAddress,
    "imageSrc": req.body.fileName,
    "contentSrc": req.body.fileName,
    "docURL": req.body.docURL,
    "description": request.body.description*/
//})  
//db.set('assets', {assetDetails: allAssets});  
//db.sync();

//db.set('assets', {});
/*db.set('assets', {
        assetDetails: [
            {
                "assetContractID": "0xea52093e33227b58860856bdcbd1d456da3d4417",
                "assetName": "ANtoine Griezmann NFT",
                "assetType": "ERC721",
                "creatorAddress":"0xea52093e33227b58860856bdcbd1d456da3d4417",
                "imageSrc":"./sky.PNG",
                "contentSrc":"./sky.PNG"
            },
            {
                "assetContractID": "0xea52093e33227b58860856bdcbd1d456da3d4417",
                "assetName": "New NFT",
                "assetType": "ERC721",
                "creatorAddress":"0xea52093e33227b58860856bdcbd1d456da3d4417",
                "imageSrc":"./sky.PNG",
                "contentSrc":"./sky.PNG"
            }
        ]
    });*/

//const HDWalletProvider = require("truffle-hdwallet-provider");

//FOR DOCKER USE secret file from /usr/app/src as shown below
//const mnemonic = require("/usr/src/app/secret/secret.json").secret;
//const FROM_ACCOUNT = require("/usr/src/app/secret/secret.json").from_account;
//const RINKEBY_RPC_URL= require("/usr/src/app/secret/secret.json").rinkeby_rpc_url;

const mnemonic = require("./secret.json").secret;
const FROM_ACCOUNT = require("./secret.json").from_account;
const RINKEBY_RPC_URL= require("./secret.json").rinkeby_rpc_url;

const pinata_api_key = require("./secret.json").pinata_api_key;
const pinata_api_secret = require("./secret.json").pinata_api_secret;
const pinata = pinataSDK(pinata_api_key, pinata_api_secret);

var Web3 = require("web3");

const express = require("express");
//const { request } = require("express");
require('dotenv').config();
var cors = require('cors')


const contract = require("./artifacts/contracts/MonalizaFactory.sol/MonalizaFactory.json")
const monaLizaContract = require("./build/contracts/Monaliza.json")

var monalizaFactoryContractAddress = "0xE30bE14Ab656d3bC09C9F7ff6Da21BdB85DEa84E";
var monalizaContractAddress = "0x48D3223C50D5aaFA697f016CADa9d785E566E99f";

//const nftFactoryContract = new web3.eth.Contract(contract.abi, monalizaFactoryContractAddress);


async function testhh(){
    //const Token = await ethers.getContractFactory("Token");
    //const accounts = await ethers.provider.listAccounts();
    //console.log(accounts);
    //const MonalizaFactory = await ethers.getContractFactory('MonalizaFactory');
    //console.log(MonalizaFactory);
    //const monalizaFactory = await MonalizaFactory.attach(monalizaFactoryContractAddress);
    /*const nftContract = new alchemyWeb3.eth.Contract(contract.abi, monalizaFactoryContractAddress);
    const nonce = await alchemyWeb3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    console.log(nonce)
    const tx = {
        'from': PUBLIC_KEY,
        'to': monalizaFactoryContractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.deployNFTContract("TST", "TST").encodeABI()
      };*/
      /*const signPromise = alchemyWeb3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
      signPromise
        .then((signedTx) => {
          alchemyWeb3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function (err, hash) {
              if (!err) {
                console.log(
                  "The hash of your transaction is: ",
                  hash,
                  "\nCheck Alchemy's Mempool to view the status of your transaction!"
                )
              } else {
                console.log(
                  "Something went wrong when submitting your transaction:",
                  err
                )
              }
            }
          ).on('receipt', receipt => { console.log('Receipt: ', JSON.stringify(receipt)); });
        })
        .catch((err) => {
          console.log(" Promise failed:", err)
        })
    console.log(signPromise);*/

    const MonalizaFactory = await ethers.getContractFactory('MonalizaFactory');
    //console.log(MonalizaFactory);
    const monalizaFactory = await MonalizaFactory.attach(monalizaFactoryContractAddress);
    var sendPromise = monalizaFactory.deployNFTContract("TST", "TST");
    sendPromise.then(function(transaction){
        console.log(transaction);
      });
    
    monalizaFactory.on("DeployContract", (name, symbol, address) => {
        console.log(address);
    });

    //const address = await monalizaFactory.deployNFTContract("TST", "TST");
    //console.log(address);
        //var out = await monalizaFactory.deployNFTContract("TST", "TST", { gasPrice: 5000000000, gasLimit: 9521975})
        //console.log(out);
    //console.log(monalizaFactory)
    //const nftFactoryContract = new alchemyWeb3.eth.Contract(contract.abi, monalizaFactoryContractAddress);
    //console.log(nftFactoryContract);
    /*var out = await nftFactoryContract.methods.deployNFTContract("TST", "TST").send({
        from:FROM_ACCOUNT, gas:3000000})
        .on('confirmation', (confirmations, receipt) => {
               console.log('CONFIRMATION');
               console.log(confirmations);
               console.log(receipt);
        })*/
    //console.log(out);
    //const MonalizaFactory = await ethers.getContractFactory("MonalizaFactory")
}
//testhh()


const app = express();
var apiProxy = httpProxy.createProxyServer({ssl: options});
var backend = 'https://speedy-nodes-nyc.moralis.io/4cc34909a23798e9e86975d8/polygon/mumbai'
app.all("/api/*", function(req, res) {
    apiProxy.web(req, res, {target: backend});
  });
const { createProxyMiddleware } = require('http-proxy-middleware');
const exampleProxy = createProxyMiddleware({target: "https://speedy-nodes-nyc.moralis.io/4cc34909a23798e9e86975d8/polygon/mumbai"});
app.use('/api2', exampleProxy);

const httpsServer = https.createServer(options, app)
const port = 443;

//pp.use(express.static('src'));
app.use(express.static("public"))
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniquePreFix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      var fileExtension = "";
      if(file.mimetype == "image/png"){
        fileExtension = ".png"
      }else if(file.mimetype == "image/jpg"){
        fileExtension = ".jpg"
      }else if(file.mimetype == "text/csv"){
        fileExtension = ".csv"
      }else if(file.mimetype == "video/mp4"){
        fileExtension = ".mp4"
      }
      cb(null, uniquePreFix + fileExtension);
    }
  })

  const upload = multer({
    //dest: './public/uploads/',
    storage: storage, 
    limits:{
      fileSize: 10000000
    },
  })


console.log(FROM_ACCOUNT);

//var Monaliza = TruffleContract(MonalizaArtifact);
//var MonalizaNFT = TruffleContract(MonalizaNFTArtifact);
//var web3Provider = new HDWalletProvider(mnemonic, RINKEBY_RPC_URL);

/*var web3Provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonic
    },
    providerOrUrl: RINKEBY_RPC_URL,
    pollingInterval: 16000
  });*/
  

    //mnemonic, "https://rpc-mumbai.matic.today")
/*Monaliza.setProvider(web3Provider);
var monalizaInstance = new Object();
var n = 1;
var imgPath = './dunst.jpg';

Monaliza.deployed().then(function(instance) {
    monalizaInstance = instance;
})*/
//app.use('/api', proxy('https://speedy-nodes-nyc.moralis.io/4cc34909a23798e9e86975d8/polygon/mumbai'));



app.post('/createairdrop', (req, res, next) => {
    console.log("Starting to createairdrop");
    console.log(req.body);
    createAirDrops(req);
    res.json({"message": "airdrop created successfully."})
})

function createAirDrops(req){
    var airdropAddresses = [];
    if(req.body.airdropAddressesMode == "file"){
        const results = [];
        
        fs.createReadStream('./public/uploads/' + req.body.airdropAddressesFileName)
        .pipe(csv({headers: false}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
            for(var i=0; i <results.length; i++){
                console.log(results[i]["0"])
                airdropAddresses.push(results[i]["0"]);
            }
            console.log("Printing email addresses in file mode");
            console.log(airdropAddresses);
            saveAirdropInMongo(airdropAddresses, req)
            .then(console.log)
            .catch(console.error)
            .finally(() => client.close());

            /*var allAirdrops;
            var airdropDetails;
            try{
                airdropDetails = db.get('airdrops').airdropDetails;
                //console.log(airdropDetails);
            }catch(e){

            }

            if(airdropDetails != undefined){
                allAirdrops =  db.get('airdrops').airdropDetails;
            }else{
                allAirdrops = new Array();
            }
            allAirdrops.push({
                "creatorAddress": req.body.creatorAddress,
                "assetContractAddress": req.body.assetContractAddress,
                "airdropAddresses": airdropAddresses,
                "creationDate": req.body.creationDate,
                "assetName": req.body.assetName,
                "description": req.body.description,
                "ipfsURL": req.body.ipfsURL,
                "docURL": req.body.docURL,
                "fileName": req.body.fileName
            })  
            db.set('airdrops', {"airdropDetails": allAirdrops});  
            db.sync();*/
            // [
            //   { NAME: 'Daffy Duck', AGE: '24' },
            //   { NAME: 'Bugs Bunny', AGE: '22' }
            // ]
        });
    }else{
        saveAirdropInMongo(req.body.airdropAddresses, req)

        /*airdropAddresses = req.body.airdropAddresses;
        console.log("Printing airdrop addresses in mnaual entry mode");
        console.log(airdropAddresses);
        var allAirdrops;
        var airdropDetails;
        try{
            airdropDetails = db.get('airdrops').airdropDetails;
            //console.log(airdropDetails);
        }catch(e){

        }

        if(airdropDetails != undefined){
            allAirdrops =  db.get('airdrops').airdropDetails;
        }else{
            allAirdrops = new Array();
        }
        allAirdrops.push({
            "creatorAddress": req.body.creatorAddress,
            "assetContractAddress": req.body.assetContractAddress,
            "airdropAddresses": airdropAddresses,
            "creationDate": req.body.creationDate,
            "assetName": req.body.assetName,
            "description": req.body.description,
            "ipfsURL": req.body.ipfsURL,
            "docURL": req.body.docURL,
            "fileName": req.body.fileName
        })  
        db.set('airdrops', {"airdropDetails": allAirdrops});  
        db.sync();*/
    }
}

async function saveAirdropInMongo(airdropAddresses, req){
    try{
        //
        console.log(JSON.stringify(airdropAddresses));
        //const MonalizaFactory = await ethers.getContractFactory('MonalizaFactory');
        //console.log(MonalizaFactory);
        //const monalizaFactory = await MonalizaFactory.attach(monalizaFactoryContractAddress);
        //var gasFeeOptions = {gasLimit: 2100000, gasPrice: 8000000000}
        /*var sendPromise = monalizaFactory.addAirDrop(req.body.assetContractAddress, airdropAddresses);
        sendPromise.then(function(transaction){
            console.log(transaction);
        });

        monalizaFactory.on("AddAirDrop", async (address)  => {
            console.log("Airdrop addresses added on-chain for " + address);
            var addressAllowed = monalizaFactory.isAddressAllowedForMinting(req.body.assetContractAddress, airdropAddresses[0]);
            addressAllowed.then(async function(status){
                console.log(status);


            })
        })*/

        await client.connect();
        console.log('Connected successfully to mongo server');
        const db = client.db(dbName);
        const collection = db.collection('airdrop');
        
        // the following code examples can be pasted here...
        const insertResult = await collection.insertOne({
            "creatorAddress": req.body.creatorAddress,
            "assetContractAddress": req.body.assetContractAddress,
            "airdropAddresses": airdropAddresses,
            "creationDate": req.body.creationDate,
            "assetName": req.body.assetName,
            "description": req.body.description,
            "ipfsURL": req.body.ipfsURL,
            "docURL": req.body.docURL,
            "fileName": req.body.fileName
        });
        console.log('Inserted documents =>', insertResult);
 
    }catch(e){
        console.log(e);
    }finally{
        client.close();
    }

   return 'done.';
}

app.get('/getairdropsforuser', async (req, res, next) => {
    console.log("In getairdropsforuser");
    //console.log(req.query.useraddress);
    var userAddress = req.query.useraddress;
    console.log(userAddress);
    var userRelevantAssets = []
    try{
        /*var allAirdrops =  db.get('airdrops').airdropDetails;
        console.log(allAirdrops);*/
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const allAirdrops = await db.collection('airdrop').find({}).toArray();
        const allAirdropsClaimed = await db.collection('airdropClaimed').find({}).toArray();
      
        // the following code examples can be pasted here...
      
        for(var i=0; i <allAirdrops.length; i++){
            if(allAirdrops[i].airdropAddresses){
                for(var j=0; j <allAirdrops[i].airdropAddresses.length; j++){
                    //console.log(userAddress);
                    //console.log(allAirdrops[i].airdropAddresses[j]);
                    try{
                        if(userAddress.toUpperCase()  === allAirdrops[i].airdropAddresses[j].toUpperCase()){
                            console.log(userAddress.toUpperCase());
                            var claimDetails = {}
                            claimDetails.claimed = false;
                            claimDetails = checkAirdropClaimed(allAirdropsClaimed, allAirdrops[i].assetContractAddress, userAddress);
                            userRelevantAssets.push({
                                "creatorAddress": allAirdrops[i].creatorAddress,
                                "assetContractAddress": allAirdrops[i].assetContractAddress,
                                "creationDate": allAirdrops[i].creationDate,
                                "assetName": allAirdrops[i].assetName,
                                "ipfsURL": allAirdrops[i].ipfsURL,
                                "description": allAirdrops[i].description,
                                "fileName": allAirdrops[i].fileName,
                                "claimed": claimDetails.claimed,
                                "tokenID": claimDetails.tokenID
                            })
                        }
                    }catch(e){
                        console.log("Got Error in address comparison");
                        console.log(e);
                    }
                }
            }
        }
    }catch(e){
        console.log(e);
    }finally{
        client.close();
    }



    function checkAirdropClaimed(allAirdropsClaimed, assetContractAddress, userAddress){
        var claimDetails = {}
        claimDetails.claimed = false;
        var allAirdropsClaimed;
        var allAirdropsClaimedDetails = allAirdropsClaimed;
        //console.log(allAirdropsClaimedDetails);
        for(var i=0; i <allAirdropsClaimedDetails.length; i++){
            if((allAirdropsClaimedDetails[i].airdropAddress.toUpperCase() == userAddress.toUpperCase()) && (allAirdropsClaimedDetails[i].assetContractAddress.toUpperCase() == assetContractAddress.toUpperCase())){
                claimDetails.claimed = true;
                claimDetails.tokenID = allAirdropsClaimedDetails[i].tokenID;
            }
        }
        return claimDetails;
      }

    //console.log(userRelevantAssets);  
    res.json(userRelevantAssets);
})

app.post('/fileupload', upload.single('file-to-upload'), (req, res, next) => {
    if (!req.file) {
      console.error(`No file selected`)
      return res.send({
        success: false
      })
    } else {
      console.log(`File uploaded`)
      console.log(req.file);
      res.send({
        success: true,
        file: req.file,
      })
    }
  })

  app.post('/deploynftcontract', async (req, res, next) => {
    try {
        console.log("Starting to execute deploynft");
        console.log(req.body);
        var name = req.body.assetName;
        var symbol = req.body.assetSymbol;
        var fileName = req.body.fileName;
        //console.log(name + " " + symbol);
        const MonalizaFactory = await ethers.getContractFactory('MonalizaFactory');
        //console.log(MonalizaFactory);
        const monalizaFactory = await MonalizaFactory.attach(monalizaFactoryContractAddress);
        var gasFeeOptions = {gasLimit: 2100000, gasPrice: 8000000000}
        //Remove it
        /*var sendPromise = await monalizaFactory.transferToken("0x410aD3b990Bf47578046dCdEFA5e11208A74441b", "0xEdB9535F3689cfedE4a309455fC33C9A7367F87D", "0x15a2AD79Cfe458A5BB2b061CCfc99426122Ac46a", 1, gasFeeOptions)
          console.log(sendPromise);
        sendPromise.then(function(value) {
          console.log(value);
        })*/
        //
        var sendPromise = await monalizaFactory.deployNFTContract(name, symbol, req.body.creatorAddress, "0x4d4581c01A457925410cd3877d17b2fd4553b2C5");
        //var sendPromise = await monalizaFactory.deployNFTContract("AAA", "AAAA", "0xEdB9535F3689cfedE4a309455fC33C9A7367F87D");
        console.log(sendPromise);
        /*sendPromise.then(function(transaction){
            console.log(transaction);
        });*/
        var eventCounter = 0;
        monalizaFactory.on("DeployContract", (name, symbol, address) => {
        //console.log(address);
            if(name == req.body.assetName && symbol == req.body.assetSymbol && eventCounter == 0){
                console.log("NFT contract address " + address);
                eventCounter ++;
                        //monalizaInstance.deployNFTContract(name, symbol, {from: FROM_ACCOUNT, gas: 4521975, gasPrice: 200000000})
        //.then(function(value) {
        //console.log(value);  
        
        //console.log("NFT contract address " + value.receipt.rawLogs[0].address);
        //console.log(value.receipt.rawLogs[0].address);
            //res.json({"contractAddress": value.receipt.rawLogs[0].address});
            
                genThumbnail('./public/uploads/' + req.body.fileName, './public/uploads/' + req.body.fileName + '.png', '250x?')
                .then(() => {
                    console.log('done!');
                    const readableStreamForThumbnailFile = fs.createReadStream('./public/uploads/' + req.body.fileName + '.png');
                    pinata.pinFileToIPFS(readableStreamForThumbnailFile, options).then((thumbNailResult) => {
                        const readableStreamForFile = fs.createReadStream('./public/uploads/' + req.body.fileName);
                            const options = {
                                pinataMetadata: {
                                    name: "somename",
                                    keyvalues: {
                                        customKey: 'customValue',
                                        customKey2: 'customValue2'
                                    }
                                },
                                pinataOptions: {
                                    cidVersion: 0
                                }
                            };

                            pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
                                console.log("In pinFileToIPFS");
                                //handle results here
                                //console.log(result);
                            //prepare metadata object
                            var metadata= {
                                "name": req.body.assetName,
                                "description": req.body.description,
                                "image": "ipfs://" + thumbNailResult.IpfsHash,
                                "youtube_url": "https://ipfs.io/ipfs/" + result.IpfsHash
                            }
                            //Create metadata URI
                            //TODO
                                const metadataOptions = {
                                    pinataMetadata: {
                                        name: "metadata",
                                        keyvalues: {
                                            customKey: 'customValue',
                                            customKey2: 'customValue2'
                                        }
                                    },
                                    pinataOptions: {
                                        cidVersion: 0
                                    }
                                };
                                pinata.pinJSONToIPFS(metadata, metadataOptions).then((metadataResult) => {
                                    console.log("In pinJSONToIPFS");
                                    saveAssetInMongo(address, req, metadataResult, res)
                                    .then(console.log)
                                    .catch(console.error)
                                    .finally(() => client.close());
                                    //return 'done.';

                                    //var allAssets =  db.get('assets').assetDetails;
                                    /*allAssets.push({
                                        "assetContractID": address,
                                        "assetName": req.body.assetName,
                                        "assetSymbol": req.body.assetSymbol,
                                        "assetType": "ERC721",
                                        "creatorAddress": req.body.creatorAddress,
                                        "imageSrc": req.body.fileName,
                                        "ipfsURL": "https://ipfs.io/ipfs/" + metadataResult.IpfsHash,
                                        "contentSrc": req.body.fileName,
                                        "docURL": req.body.docURL || '',
                                        "description": req.body.description  || ''
                                    })  
                                    db.set('assets', {"assetDetails": allAssets});  
                                    db.sync();*/
                                }).catch((err) => {
                                    //handle error here
                                    console.log(err);
                                    //client.close();
                                });
                            
                            }).catch((err) => {
                                //handle error here
                                console.log(err);
                            });
                        


                    }).catch((err) => {
                        //handle error here
                        console.log(err);
                    });
                })
                .catch(err => console.error(err))
                }
            

            });  
        } catch (error) {
            console.log(error)
            return next(error)
        }   
    //processNFTContractDeployment(req, res)
    //}).catch(function(err) {
    //    console.log(err);
    //});
    //return monalizaInstance.mint(req.query.contractaddress, req.query.toaddress, req.query.tokenuri, {from: process.env.FROM_ACCOUNT, gas: 4600000});
    })

    async function saveAssetInMongo(address, req, metadataResult, res){
        console.log("In saveAssetInMongo " + req.body.assetName + " " + req.body.assetSymbol + " " + req.body.description)
        await client.connect();
        console.log('Connected successfully to mongo server');
        const db = client.db(dbName);
        const collection = db.collection('assets');
        
        // the following code examples can be pasted here...
        const insertResult = await collection.insertOne({
            "assetContractID": address,
            "assetName": req.body.assetName,
            "assetSymbol": req.body.assetSymbol,
            "assetType": "ERC721",
            "creatorAddress": req.body.creatorAddress,
            "imageSrc": req.body.fileName,
            "ipfsURL": "https://ipfs.io/ipfs/" + metadataResult.IpfsHash + "?filename=metadata.json",
            "contentSrc": req.body.fileName,
            "docURL": req.body.docURL || '',
            "description": req.body.description  || ''
        });
        console.log('Inserted documents =>', insertResult);
        res.json({"contractAddress": address});
        return 'done.';
    }

    async function saveAssetInMongoFromEmail(address, contractDetails, metadataResult){
        console.log("In saveAssetInMongo from email" + contractDetails.assetName + " " + contractDetails.assetSymbol + " " + contractDetails.description)
        await client.connect();
        console.log('Connected successfully to mongo server');
        const db = client.db(dbName);
        const collection = db.collection('assets');
        
        // the following code examples can be pasted here...
        const insertResult = await collection.insertOne({
            "assetContractID": address,
            "assetName": contractDetails.assetName,
            "assetSymbol": contractDetails.assetSymbol,
            "assetType": "ERC721",
            "creatorAddress": contractDetails.creatorAddress,
            "imageSrc": contractDetails.fileName,
            "ipfsURL": "https://ipfs.io/ipfs/" + metadataResult.IpfsHash + "?filename=metadata.json",
            "contentSrc": contractDetails.fileName,
            "docURL": contractDetails.docURL || '',
            "description": contractDetails.description  || ''
        });
        console.log('Inserted documents =>', insertResult);
        //res.json({"contractAddress": address});
        return 'done.';
    }

    async function processNFTContractDeployment(req, res){
            //res.send('NFT contract deployment started!' + " with " + req.query.name + " " + req.query.symbol);
            var name = req.body.assetName;
            var symbol = req.body.assetSymbol;
            var fileName = req.body.fileName;
            console.log(name + " " + symbol);
            const MonalizaFactory = await ethers.getContractFactory('MonalizaFactory');
            //console.log(MonalizaFactory);
            const monalizaFactory = await MonalizaFactory.attach(monalizaFactoryContractAddress);
            var newNonce = await ethers.provider.getTransactionCount(req.body.creatorAddress) + 1;
            var options = {nonce: newNonce}
            var sendPromise = monalizaFactory.deployNFTContract(name, symbol);
            sendPromise.then(function(transaction){
                console.log(transaction);
            });
            
            monalizaFactory.on("DeployContract", (address) => {
                //console.log(address);
            
            //monalizaInstance.deployNFTContract(name, symbol, {from: FROM_ACCOUNT, gas: 4521975, gasPrice: 200000000})
            //.then(function(value) {
            //console.log(value);  
            console.log("NFT contract address " + address);
            //console.log("NFT contract address " + value.receipt.rawLogs[0].address);
            //console.log(value.receipt.rawLogs[0].address);
                //res.json({"contractAddress": value.receipt.rawLogs[0].address});
                if (res.headersSent) {
                    return next(err)
                  }else {
                    res.json({"contractAddress": address});
                  }
                

                genThumbnail('./public/uploads/' + req.body.fileName, './public/uploads/' + req.body.fileName + '.png', '250x?')
                .then(() => {
                    console.log('done!');
                    const readableStreamForThumbnailFile = fs.createReadStream('./public/uploads/' + req.body.fileName + '.png');
                    pinata.pinFileToIPFS(readableStreamForThumbnailFile, options).then((thumbNailResult) => {
                        const readableStreamForFile = fs.createReadStream('./public/uploads/' + req.body.fileName);
                            const options = {
                                pinataMetadata: {
                                    name: "somename",
                                    keyvalues: {
                                        customKey: 'customValue',
                                        customKey2: 'customValue2'
                                    }
                                },
                                pinataOptions: {
                                    cidVersion: 0
                                }
                            };

                            pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
                                //handle results here
                                //console.log(result);
                            //prepare metadata object
                            var metadata= {
                                "name": req.body.assetName,
                                "description": req.body.description,
                                "image": "ipfs://" + thumbNailResult.IpfsHash,
                                "youtube_url": "https://ipfs.io/ipfs/" + result.IpfsHash
                            }
                            //Create metadata URI
                            //TODO
                                const metadataOptions = {
                                    pinataMetadata: {
                                        name: "metadata",
                                        keyvalues: {
                                            customKey: 'customValue',
                                            customKey2: 'customValue2'
                                        }
                                    },
                                    pinataOptions: {
                                        cidVersion: 0
                                    }
                                };
                                pinata.pinJSONToIPFS(metadata, metadataOptions).then((metadataResult) => {
                                    var allAssets =  db.get('assets').assetDetails;
                                    allAssets.push({
                                        "assetContractID": address,
                                        "assetName": req.body.assetName,
                                        "assetSymbol": req.body.assetSymbol,
                                        "assetType": "ERC721",
                                        "creatorAddress": req.body.creatorAddress,
                                        "imageSrc": req.body.fileName,
                                        "ipfsURL": "https://ipfs.io/ipfs/" + metadataResult.IpfsHash + "?filename=metadata.json",
                                        "contentSrc": req.body.fileName,
                                        "docURL": req.body.docURL || '',
                                        "description": req.body.description  || ''
                                    })  
                                    db.set('assets', {"assetDetails": allAssets});  
                                    db.sync();
                                }).catch((err) => {
                                    //handle error here
                                    console.log(err);
                                });
                            
                            }).catch((err) => {
                                //handle error here
                                console.log(err);
                            });
                        


                    }).catch((err) => {
                        //handle error here
                        console.log(err);
                    });
                })
                .catch(err => console.error(err))
                });  
    }

app.post('/deploynftcontract2', (req, res, next) => {
    console.log("Starting to execute deploynft");
    console.log(req.body);
    //res.send('NFT contract deployment started!' + " with " + req.query.name + " " + req.query.symbol);
    var name = req.body.assetName;
    var symbol = req.body.assetSymbol;
    var fileName = req.body.fileName;
    console.log(name + " " + symbol);
    monalizaInstance.deployNFTContract(name, symbol, {from: FROM_ACCOUNT, gas: 4521975, gasPrice: 200000000})
  .then(function(value) {
    console.log(value);  
    console.log("NFT contract address " + value.receipt.rawLogs[0].address);
    console.log(value.receipt.rawLogs[0].address);
        res.json({"contractAddress": value.receipt.rawLogs[0].address});

        genThumbnail('./public/uploads/' + req.body.fileName, './public/uploads/' + req.body.fileName + '.png', '250x?')
        .then(() => {
            console.log('done!');
            const readableStreamForThumbnailFile = fs.createReadStream('./public/uploads/' + req.body.fileName + '.png');
            pinata.pinFileToIPFS(readableStreamForThumbnailFile, options).then((thumbNailResult) => {
                const readableStreamForFile = fs.createReadStream('./public/uploads/' + req.body.fileName);
                    const options = {
                        pinataMetadata: {
                            name: "somename",
                            keyvalues: {
                                customKey: 'customValue',
                                customKey2: 'customValue2'
                            }
                        },
                        pinataOptions: {
                            cidVersion: 0
                        }
                    };

                    pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
                        //handle results here
                        //console.log(result);
                       //prepare metadata object
                       var metadata= {
                        "name": req.body.assetName,
                        "description": req.body.description,
                        "image": "ipfs://" + thumbNailResult.IpfsHash,
                        "video": "ipfs://" + result.IpfsHash
                    }
                    //Create metadata URI
                    //TODO
                        const metadataOptions = {
                            pinataMetadata: {
                                name: "metadata",
                                keyvalues: {
                                    customKey: 'customValue',
                                    customKey2: 'customValue2'
                                }
                            },
                            pinataOptions: {
                                cidVersion: 0
                            }
                        };
                        pinata.pinJSONToIPFS(metadata, metadataOptions).then((metadataResult) => {
                            var allAssets =  db.get('assets').assetDetails;
                            allAssets.push({
                                "assetContractID": value.receipt.rawLogs[0].address,
                                "assetName": req.body.assetName,
                                "assetSymbol": req.body.assetSymbol,
                                "assetType": "ERC721",
                                "creatorAddress": req.body.creatorAddress,
                                "imageSrc": req.body.fileName,
                                "ipfsURL": "https://ipfs.io/ipfs/" + metadataResult.IpfsHash + "?filename=metadata.json",
                                "contentSrc": req.body.fileName,
                                "docURL": req.body.docURL || '',
                                "description": req.body.description  || ''
                            })  
                            db.set('assets', {"assetDetails": allAssets});  
                            db.sync();
                        }).catch((err) => {
                            //handle error here
                            console.log(err);
                        });
                    
                    }).catch((err) => {
                        //handle error here
                        console.log(err);
                    });
                


            }).catch((err) => {
                //handle error here
                console.log(err);
            });
        })
        .catch(err => console.error(err))

    }).catch(function(err) {
        console.log(err);
    });
    //return monalizaInstance.mint(req.query.contractaddress, req.query.toaddress, req.query.tokenuri, {from: process.env.FROM_ACCOUNT, gas: 4600000});
})


app.post('/claimairdrop', async (req, res) => {
    console.log(req.body);
    //if(! req.body.tokenID) res.send({message: "toeknID not available"});
    //STEP 1: Check if already airdropped or not (check in Mongo DB)


    //STEP 2: Check if signature is for the user address in request or not
    console.log("NFT minting started");
    
    //Get user address from sign
    //const signingAddress = Web3.eth.personal.ecRecover("claimairdrop", sign);
    //console.log(signingAddress.userAddress);

    //const recovered = ethSigUtil.recoverPersonalSignature({data: req.body.msg, signature: req.body.sign});
    //console.log(recovered);
    var checkIfClaimed = await checkAirdropClaimedInMongo(req.body.userAddress, req.body.assetContractAddress);

    //var checkIfClaimed = await checkAirdropClaimedInMongo(req.body.userAddress, req.body.assetContractAddress);
    console.log("printing checkIfClaimed");
    console.log(checkIfClaimed);
    if(req.body.assetContractAddress && checkIfClaimed.length > 0){
        res.send({message: "asset contract already claimed once"});
        return;
    }

    if(checkIfClaimed.length < 1 && req.body.assetContractAddress){
    //if((recovered.toUpperCase() == req.body.userAddress.toUpperCase()) && checkIfClaimed.length < 1 && req.body.assetContractAddress){
        console.log(await ethers.provider.getTransactionCount(req.body.pubAddress));
        var newNonce = await ethers.provider.getTransactionCount(req.body.pubAddress) + 1;
        const MonalizaFactory = await ethers.getContractFactory('MonalizaFactory');
        const Monaliza = await ethers.getContractFactory('Monaliza');
        //console.log(MonalizaFactory);
        const monalizaFactory = await MonalizaFactory.attach(monalizaFactoryContractAddress);
        const monaliza = await Monaliza.attach(req.body.assetContractAddress);
        //const monaliza = await Monaliza.attach(monalizaContractAddress);
        //var options = { gasPrice: 1000000000, gasLimit: 85000, nonce: newNonce + 1, value: 0 };
        var options = { nonce: newNonce};

        var gasFeeOptions = {gasLimit: 2100000, gasPrice: 8000000000}
    
        var sendPromise = await monalizaFactory.mintNFT(req.body.assetContractAddress, req.body.pubAddress, req.body.ipfsURL, gasFeeOptions);
        console.log(sendPromise);
        //Check if transaction hash is sucessful
        //https://ethereum.stackexchange.com/questions/80617/how-can-i-know-a-hash-mined-and-confirmed-by-ethers-js/80622
        var delayInMilliseconds = 5000; //1 second

        const sayHello = async (name) => {
            console.log(`Hello ${name}. Welcome to KindaCode.com`);
            var tokenIDObtained = await monalizaFactory.getLastTokenID(req.body.assetContractAddress);
            console.log(tokenIDObtained);
            console.log("token ID from fn call is " + tokenIDObtained.toString());
            //var tx =  await monaliza.setApprovalForAll("0x72c9B90c57A3e1AB19A8A2C81828d52fff5a0E49", true, gasFeeOptions);
            //console.log(tx);
            //var status = await monaliza.isApprovedForAll("0xEdB9535F3689cfedE4a309455fC33C9A7367F87D","0x72c9B90c57A3e1AB19A8A2C81828d52fff5a0E49", gasFeeOptions)
            //console.log(status);
            /*var sendPromise = await monaliza.approve("0x15a2AD79Cfe458A5BB2b061CCfc99426122Ac46a", 1, gasFeeOptions)
            console.log(sendPromise);
            var sendPromise2 = await monaliza.transferFrom("0x5Bd46de6E8d4e8Ba0fdd76ACC8d543bA07b58dE5", "0x15a2AD79Cfe458A5BB2b061CCfc99426122Ac46a", 1, gasFeeOptions)
            console.log(sendPromise2);*/
          }
          
          console.log('Waiting...');
          setTimeout(sayHello, 6000, 'John Doe');

        //Invoke contract function getLastTokenID(Monaliza contractAddress) and get tokenID


        var eventCounter = 0;
        monalizaFactory.on("Mint", (address, tokenID) => {
        //console.log(address);
            if(address == req.body.assetContractAddress && eventCounter == 0){
                console.log("NFT token ID " + tokenID);
                eventCounter ++;
                //console.log("NFT minted transaction id is " + tokenID);
                //add to airdropped list and prevent duplicate claim
                //console.log(result);
                //console.log("tokenID is " + tokenID);
                res.send({assetContractID: req.body.assetContractAddress, tokenID: tokenID.toString()});
                /*var allAirdropsClaimed;
                var allAirdropsClaimedDetails;
                try{
                    allAirdropsClaimedDetails = db.get('allAirdropsClaimed').allAirdropsClaimedDetails;
                    //console.log(airdropDetails);
                }catch(e){
            
                }*/
                saveAirdropClaimedInMongo(req, tokenID.toString())
                .then(console.log)
                .catch(console.error)
                .finally(() => client.close());
    
                    /*if(allAirdropsClaimedDetails != undefined){
                        allAirdropsClaimed =  db.get('allAirdropsClaimed').allAirdropsClaimedDetails;
                    }else{
                        allAirdropsClaimed = new Array();
                    }
                    allAirdropsClaimed.push({
                        "assetContractAddress": req.body.assetContractAddress,
                        "airdropAddress": req.body.userAddress,
                        "tokenID": tokenID.toString()
                    })  
                    db.set('allAirdropsClaimed', {"allAirdropsClaimedDetails": allAirdropsClaimed});  
                    //console.log(db.get('allAirdropsClaimed').allAirdropsClaimedDetails);
                    db.sync();*/
           
            }
        })


        async function saveAirdropClaimedInMongo(req, tokenIDValue){
            try{
                await client.connect();
                console.log('Connected successfully to mongo server');
                const db = client.db(dbName);
                const collection = db.collection('airdropClaimed');
                
                // the following code examples can be pasted here...
                const insertResult = await collection.insertOne({
                    "assetContractAddress": req.body.assetContractAddress,
                    "airdropAddress": req.body.userAddress,
                    "tokenID": tokenIDValue
                });
                console.log('Inserted documents =>', insertResult);
            }catch(e){
                console.log(e);
            }finally{
                client.close();
            }
        
           return 'done.';
        }
        
        
        /*monalizaInstance.mintNFT(req.body.assetContractAddress, req.body.userAddress, req.body.ipfsURL , {from: FROM_ACCOUNT, gas: 4521975, gasPrice: 200000000}).then
        (function(result){
            console.log("NFT minted transaction id is " + result.tx);
            //add to airdropped list and prevent duplicate claim
            console.log(result);
            console.log("tokenID is " + result.receipt.logs[0].args.newItemId);
            res.send({"txID": result.tx, assetContractID: req.body.assetContractAddress, tokenID: result.receipt.logs[0].args.newItemId});
            var allAirdropsClaimed;
            var allAirdropsClaimedDetails;
            try{
                allAirdropsClaimedDetails = db.get('allAirdropsClaimed').allAirdropsClaimedDetails;
                //console.log(airdropDetails);
            }catch(e){
        
            }
        
            if(allAirdropsClaimedDetails != undefined){
                allAirdropsClaimed =  db.get('allAirdropsClaimed').allAirdropsClaimedDetails;
            }else{
                allAirdropsClaimed = new Array();
            }
            allAirdropsClaimed.push({
                "assetContractAddress": req.body.assetContractAddress,
                "airdropAddress": req.body.userAddress,
                "tokenID": result.receipt.logs[0].args.newItemId
            })  
            db.set('allAirdropsClaimed', {"allAirdropsClaimedDetails": allAirdropsClaimed});  
            //console.log(db.get('allAirdropsClaimed').allAirdropsClaimedDetails);
            db.sync();
       
        }).catch(function(err) {
           console.log(err);
        });*/
    
    
    }

    async function checkAirdropClaimedInMongo(userAddress, assetContractAddress){
        var result;
        try{
            await client.connect();
            console.log('Connected successfully to mongo server');
            const db = client.db(dbName);
            const collection = db.collection('airdropClaimed');
            result = await collection.find({airdropAddress: userAddress, assetContractAddress: assetContractAddress}).toArray();
            console.log(result)

        }catch(e){
            console.log(e);
        }finally{
            client.close();
            return result;
        }
    
       //return 'done.';
    }    
   
})

app.post('/deployandmintnft_v2', (req, res) => {
    console.log("Starting to execute deploynft");
    //res.send('NFT contract deployment started!' + " with " + req.query.name + " " + req.query.symbol);
    var name = req.body.assetName;
    var symbol = req.body.assetSymbol;
    console.log(req.body)
    monalizaInstance.deployNFTContract(name, symbol, {from: FROM_ACCOUNT, gas: 5000000})
  .then(function(value) {
    console.log("NFT contract address " + value.receipt.rawLogs[0].address);
    var erc721ContractAddress = value.receipt.rawLogs[0].address;
    console.log(value.receipt.rawLogs[0].address);
        //res.json({"contractAddress": value.receipt.rawLogs[0].address});
        //NFT ERC721 contract is deployed. Now mint the NFT from this contract
        console.log("NFT minting started");
        //Use the file provided by user
        const readableStreamForFile = fs.createReadStream("./public/uploads/" + req.body.fileName);
        const options = {
            pinataMetadata: {
                name: name,
                keyvalues: {
                    docURL: req.body.docURL,
                    description: req.body.description
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
            //handle results here
            console.log(result);
            var addresses = req.body.addresses;
            console.log(addresses.length);
            for(var i=0; i<addresses.length; i++){
                console.log("NFT minting started from account " + FROM_ACCOUNT);
                monalizaInstance.mintNFT(erc721ContractAddress, addresses[i], "https://ipfs.io/ipfs/" + result.IpfsHash, {from: FROM_ACCOUNT, gas: 4600000}).then
                (function(result){
                    console.log("NFT minted transaction id is " + result.tx)
                    res.json({"message": "NFT with contract address " + erc721ContractAddress + " minted and transfer to first address " + addresses[0] + " is complete and transaction id is " + result.tx + " . Check it on https://rinkeby.etherscan.io"})
                }).catch(function(err) {
                console.log(err);
                });
            }
        
        }).catch((err) => {
            //handle error here
            console.log(err);
        });


    }).catch(function(err) {
        console.log(err.message);
    });
})

app.get('/deployandmintnft', (req, res) => {
    //res.send('NFT contract deployment started!');

        const axios = require('axios');
        const fs = require('fs');
        const FormData = require('form-data');
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        //we gather a local file from the API for this example, but you can gather the file from anywhere
            let data = new FormData();
            data.append('file', fs.createReadStream(imgPath));
        return axios.post(url,
                data,
                {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                        'pinata_api_key': pinata_api_key,
                        'pinata_secret_api_key': pinata_api_secret
                    }
                }
            ).then(function (response) {
                //handle response here
                console.log(response.data);

                Monaliza.deployed().then(function(instance) {
                    monalizaInstance = instance;
                    console.log("Initiating deployment of NFT contract");
                    return monalizaInstance.deployNFTContract(req.query.name, req.query.symbol, {from: FROM_ACCOUNT, gas: 4600000});
                    //return monalizaInstance.mint(req.query.contractaddress, req.query.toaddress, req.query.tokenuri, {from: process.env.FROM_ACCOUNT, gas: 4600000});
                    }).then(function(value) {
                        console.log("NFT contract address " + value.receipt.rawLogs[0].address);
                        console.log(value.receipt.rawLogs[0].address);
                        res.json({"contractAddress": value.receipt.rawLogs[0].address});
                        //Now mint NFT
                        monalizaInstance.mintNFT(value.receipt.rawLogs[0].address, req.query.toaddress, req.query.tokenuri + "/" + response.data.IpfsHash, {from: process.env.FROM_ACCOUNT, gas: 4600000})
                        .then(function(result){
                            console.log("NFT minted");
                            
                        }).catch(function(err) {
                        console.log(err.message);
                        });
            
                    }).catch(function(err) {
                    console.log(err.message);
                    });

            }).catch(function (error) {
                //handle error here
                console.log(error);
            });

})

app.get('/pinnftfile', (req, res) => {
        //imports needed for this function
    const axios = require('axios');
    const fs = require('fs');
    const FormData = require('form-data');
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //we gather a local file from the API for this example, but you can gather the file from anywhere
        let data = new FormData();
        data.append('file', fs.createReadStream('./bs-config.json'));
    return axios.post(url,
            data,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                    'pinata_api_key': "3e1596561b8dad3f06ca",
                    'pinata_secret_api_key': "ef713e5847f3113a44520040821fb5bfd7d498f8e6f70ed84c1fcc72514b7b9d"
                }
            }
        ).then(function (response) {
            //handle response here
            console.log(response.data);
        }).catch(function (error) {
            //handle error here
            console.log(error);
        });
    
})

app.get('/getmemetokenbalance', (req, res) => {
    var secretKey = process.env.SECRET_KEY;
    request('https://api.covalenthq.com/v1/80001/address/' + req.query.address + '/balances_v2/?key=' + secretKey, function(err, res, body) {
    console.log(body);
});
})

app.get('/assetsforuseraddress', async function (req, res) {
    var userAddress = req.query.useraddress;
    console.log(userAddress);
    await client.connect();
    console.log('Connected successfully to server');
    const db = await client.db(dbName);
    const allAssets = await db.collection('assets').find({}).toArray();

    //var allAssets = db.get('assets');
    console.log(allAssets);
    var userCreatedAssets = [];
    for(var i=0; i < allAssets.length; i++){
        console.log(allAssets[i].creatorAddress);
        if(userAddress == allAssets[i].creatorAddress){
            userCreatedAssets.push(allAssets[i]);
        }
    }
    console.log(userCreatedAssets);
    res.json(userCreatedAssets);
})

app.post('/findpublicaddressbyemail', async (req, res) => {
     console.log(req.body);
     if(req.body.email == "georgesmith9914@gmail.com"){
        res.json({"publicAddress": "0x15a2AD79Cfe458A5BB2b061CCfc99426122Ac46a", "email": "georgesmith9914@gmail.com"})
     }else if(req.body.email == "aina.fournier@gmail.com"){
        res.json({"publicAddress": "0xCd04943Ef3D7250603927d4038a88Bb15342b7A5", "email": "aina.fournier@gmail.com"})
     }
     
});

app.post('/requestvercode', async (req, res) => {
    console.log(req.body.email);
    res.json({"message":"verification code being sent on email"})
    //Now send the verification code on email
    var verificationCode = Math.floor(100000 + Math.random() * 900000);
    //Save code in Mongo
    await client.connect();
    console.log('Connected successfully to mongo server');
    const db = client.db(dbName);
    const collection = db.collection('vercodes');
    const query = { email: req.body.email };
    const update = { $set: { email: req.body.email, verificationCode: verificationCode }};
    const options = { upsert: true };
    const upsertResult = await collection.updateOne(query, update, options);

    console.log('upserted documents =>', upsertResult);

    //Send code on email to user
    fs.readFile('credentials.json', (err, content) => {
        console.log(JSON.parse(content));
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), req.body.email, verificationCode, sendMessageForVerificationCode);
    });
});

app.post('/checkvercode', async (req, res) => {
    console.log(req.body.email);
    
    //Check code from Mongo
    await client.connect();
    console.log('Connected successfully to mongo server');
    const db = client.db(dbName);
    const collection = db.collection('vercodes');
    result = await collection.find({email: req.body.email}).toArray();
    console.log(result[0].verificationCode);
    if(result[0].verificationCode == req.body.code){
        res.json({"message":"success"})
    }else{
        res.json({"message":"failure"})
    }
});

app.post('/movetokentosent', async (req, res) => {
    console.log(req.body);

    
});

app.get('/checkemails', async (req, res) => {
    // Load client secrets from a local file.
 
    fs.readFile('credentials.json', (err, content) => {
        console.log(JSON.parse(content));
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listMessages);
    //authorize(JSON.parse(content), watchEmail);

    //authorize(JSON.parse(content), listLabels);
    });
    res.json({"message": "emails being fetched"});
});

/*var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 5 minutes check");
  // do your stuff here
  fs.readFile('credentials.json', (err, content) => {
    console.log(JSON.parse(content));
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listMessages);
    //authorize(JSON.parse(content), watchEmail);

    //authorize(JSON.parse(content), listLabels);
    });
}, the_interval);*/


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, to, verificationCode, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, to, verificationCode);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

function watchEmail(auth){
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.watch({
        userId: 'me',
      }, (err, res) => {
          console.log("user watch");
          console.log(err);
          console.log(res);
    })
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
 function listMessages(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.list({
      userId: 'me',
      labelIds:['UNREAD']
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      console.log(res.data)
      const messages = res.data.messages;
      if (messages.length) {
        console.log('Messages:');
        messages.forEach((message) => {
          console.log(`- ${message.id}`);
          var fromEmail, assetName, assetSymbol, creatorAddress, description, imageName;

          gmail.users.messages.get({userId: 'me', id: message.id}, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
             email = response.data
             console.log(email)

             

             for(var j=0; j < email.payload.parts.length; j++){
                    //if (j < 2){
                        console.log(JSON.stringify(email.payload.parts[0].parts[0].body))
                        description = base64.decode(JSON.stringify(email.payload.parts[0].parts[0].body.data)).split('\n')[0]
                        console.log(description)
                    //}

                    if((email.payload.parts[j].filename != "") && (email.payload.parts[j].mimeType == "image/png")){
                        console.log(JSON.stringify(email.payload.parts[j].filename))

                        gmail.users.messages.attachments.get({
                            userId: 'me',
                            messageId: message.id,
                            id: email.payload.parts[j].body.attachmentId
                        }, (err, {data}) => {
                            if (err) return console.log('Error getting attachment: ' + err)
                            //console.log('attachment' + JSON.stringify(data.data))

                            var rawImg = data.data,
                            base64Data = rawImg.replace(/^data:image\/png;base64,/, '')
                            var dirpath = './public/uploads/'
                            const uniquePreFix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                            imageName = uniquePreFix + '.png'
                            console.log(imageName)
                            var imageLocation = dirpath + imageName;
                            fs.writeFile(imageLocation, base64Data, 'base64', function(err) {
                                for(var i=0; i < email.payload.headers.length; i++){
                                    if(email.payload.headers[i].name == "Subject"){
                                       assetName = JSON.stringify(email.payload.headers[i].value)
                                       console.log("assetName " + assetName);
                   
                                       assetSymbol = assetName.substring(0,3).toUpperCase();
                                   }
                   
                                   if(email.payload.headers[i].name == "From"){
                                       var components = JSON.stringify(email.payload.headers[i]).split('<')
                                       var emailAddress = components[1].replace('>', '');
                                       emailAddress = emailAddress.replace('"', '');
                                       emailAddress = emailAddress.replace('}', '');
                                       emailAddress = emailAddress.replace('>', '');
                                       fromEmail = emailAddress;
                                       console.log("fromEmail " + fromEmail)
                                   }
                                }

                                if(fromEmail == "georgesmith9914@gmail.com"){
                                creatorAddress =  "0x15a2AD79Cfe458A5BB2b061CCfc99426122Ac46a"
                                    }else if(fromEmail == "aina.fournier@gmail.com"){
                                    creatorAddress = "0xCd04943Ef3D7250603927d4038a88Bb15342b7A5"
                                }else if(fromEmail == "createnftnow@gmail.com"){
                                    creatorAddress = "0x5Bd46de6E8d4e8Ba0fdd76ACC8d543bA07b58dE5"
                                }
                                console.log("creatorAddress " + creatorAddress);
                                console.log(response);
                                console.log("Preparing for NFT contract creation now");
                                console.log(fromEmail)
                                var contractDetails = {}
                                var assetNameComponents = assetName.split('"')
                                 assetName = assetNameComponents[1].replace('"', '');
                                 assetName = assetName.replace('"', '');
                                contractDetails.assetName = assetName;
                                contractDetails.assetSymbol = assetSymbol;
                                contractDetails.fileName = imageName;
                                contractDetails.creatorAddress = creatorAddress;
                                contractDetails.auth = auth;
                                contractDetails.to = fromEmail;
                                
                                gmail.users.messages.modify({userId: 'me', id: message.id,
                                    'resource': {
                                        'addLabelIds':[],
                                        'removeLabelIds': ['UNREAD']
                                    }}, function (err, response) {
                                    if (err) {
                                        console.log('The API returned an error: ' + err);
                                        return;
                                    }
                                    deployNFTContractbyEmail(contractDetails);    
                                })

                           });



                        })    



                        //Send email to sender email that NFT creation request has been received
                        

                        

                        //If user account on Monaliza exists, create asset contract

                        //Else park the asset file & details and ask user to create account
                        //createAssetContractandSendEmail(auth, fromEmail, assetName, assetSymbol, creatorAddress, description);

                        
                        //sendMessage(auth);
                        //console.log(JSON.stringify(email.payload.parts[j]))
                    }
            }
        })

       });
      } else {
        console.log('No messages found.');
      }
    });
  }
  function makeBody(to, subject, contractAddress) {
    /*var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail; */
        var message = "NFT asset created successfully. You can <a href='https://178.128.141.196/airdrop.html'>airdrop<a/> now on Monaliza. Check on Polygon scan " + "<a href='https://mumbai.polygonscan.com/address/" + contractAddress + "'>here<a/>"
        var email =
        "From: 'me'\r\n" +
        "To: " + to + "\r\n" +
        "Subject: " + subject + "\r\n" +
        "Content-Type: text/html; charset='UTF-8'\r\n" +
        "Content-Transfer-Encoding: base64\r\n\r\n" +
        "<html><body>" +
        message +
        "</body></html>";
        var encodedMail = new Buffer(email).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail; 
    }

    function sendMessage(to, auth, contractAddress) {
        var raw = makeBody(to, 'NFT asset created successfully on Monaliza', contractAddress);
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.send({
            auth: auth,
            userId: 'me',
            resource: {
                raw: raw
            }
        
        }, function(err, response) {
            console.log(err);
            return(err || response)
        });
    }

    function makeBodyForVerificationCode(to, subject, verificationCode) {
            var message = "Your Monaliza sign-in verification code is " + verificationCode + " .";
            var email =
            "From: 'me'\r\n" +
            "To: " + to + "\r\n" +
            "Subject: " + subject + "\r\n" +
            "Content-Type: text/html; charset='UTF-8'\r\n" +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            "<html><body>" +
            message +
            "</body></html>";
            var encodedMail = new Buffer(email).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
            return encodedMail; 
        }

  function sendMessageForVerificationCode(auth, to, verificationCode) {
    var raw = makeBodyForVerificationCode(to, 'Your Monaliza Sign-In Verification Code', verificationCode);
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        resource: {
            raw: raw
        }
    
    }, function(err, response) {
        console.log(err);
        return(err || response)
    });
}

  async function deployNFTContractbyEmail(contractDetails){
        try {
            console.log("Starting to execute deploynft");
            console.log(contractDetails);
            var name = contractDetails.assetName;
            //name = name.replace('"', '');
            var symbol = contractDetails.assetSymbol;
            var fileName = contractDetails.fileName;
            console.log(name + " " + symbol);
            const MonalizaFactory = await ethers.getContractFactory('MonalizaFactory');
            //console.log(MonalizaFactory);
            const monalizaFactory = await MonalizaFactory.attach(monalizaFactoryContractAddress);
            var sendPromise = await monalizaFactory.deployNFTContract(name, symbol, contractDetails.creatorAddress);
            /*sendPromise.then(function(transaction){
                console.log(transaction);
            });*/
            var eventCounter = 0;
            monalizaFactory.on("DeployContract", (name, symbol, address) => {
            //console.log(address);
                if(name == contractDetails.assetName && symbol == contractDetails.assetSymbol && eventCounter == 0){
                    console.log("NFT contract address " + address);
                    eventCounter ++;
                            //monalizaInstance.deployNFTContract(name, symbol, {from: FROM_ACCOUNT, gas: 4521975, gasPrice: 200000000})
            //.then(function(value) {
            //console.log(value);  
            
            //console.log("NFT contract address " + value.receipt.rawLogs[0].address);
            //console.log(value.receipt.rawLogs[0].address);
                //res.json({"contractAddress": value.receipt.rawLogs[0].address});
                
                    genThumbnail('./public/uploads/' + contractDetails.fileName, './public/uploads/' + contractDetails.fileName + '.png', '250x?')
                    .then(() => {
                        console.log('done!');
                        const readableStreamForThumbnailFile = fs.createReadStream('./public/uploads/' + contractDetails.fileName + '.png');
                        pinata.pinFileToIPFS(readableStreamForThumbnailFile, options).then((thumbNailResult) => {
                            const readableStreamForFile = fs.createReadStream('./public/uploads/' + contractDetails.fileName);
                                const options = {
                                    pinataMetadata: {
                                        name: "somename",
                                        keyvalues: {
                                            customKey: 'customValue',
                                            customKey2: 'customValue2'
                                        }
                                    },
                                    pinataOptions: {
                                        cidVersion: 0
                                    }
                                };
    
                                pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
                                    console.log("In pinFileToIPFS");
                                    //handle results here
                                    //console.log(result);
                                //prepare metadata object
                                var metadata= {
                                    "name": contractDetails.assetName,
                                    "description": contractDetails.description,
                                    "image": "ipfs://" + thumbNailResult.IpfsHash,
                                    "youtube_url": "https://ipfs.io/ipfs/" + result.IpfsHash
                                }
                                //Create metadata URI
                                //TODO
                                    const metadataOptions = {
                                        pinataMetadata: {
                                            name: "metadata",
                                            keyvalues: {
                                                customKey: 'customValue',
                                                customKey2: 'customValue2'
                                            }
                                        },
                                        pinataOptions: {
                                            cidVersion: 0
                                        }
                                    };
                                    pinata.pinJSONToIPFS(metadata, metadataOptions).then((metadataResult) => {
                                        console.log("In pinJSONToIPFS");
                                        saveAssetInMongoFromEmail(address, contractDetails, metadataResult)
                                        .then(console.log)
                                        .catch(console.error)
                                        .finally(() => client.close());
                                        //return 'done.';
    
                                        //var allAssets =  db.get('assets').assetDetails;
                                        /*allAssets.push({
                                            "assetContractID": address,
                                            "assetName": req.body.assetName,
                                            "assetSymbol": req.body.assetSymbol,
                                            "assetType": "ERC721",
                                            "creatorAddress": req.body.creatorAddress,
                                            "imageSrc": req.body.fileName,
                                            "ipfsURL": "https://ipfs.io/ipfs/" + metadataResult.IpfsHash,
                                            "contentSrc": req.body.fileName,
                                            "docURL": req.body.docURL || '',
                                            "description": req.body.description  || ''
                                        })  
                                        db.set('assets', {"assetDetails": allAssets});  
                                        db.sync();*/
                                        sendMessage(contractDetails.to, contractDetails.auth, address);  
                                    }).catch((err) => {
                                        //handle error here
                                        console.log(err);
                                        //client.close();
                                    });
                                
                                }).catch((err) => {
                                    //handle error here
                                    console.log(err);
                                });
                            
    
    
                        }).catch((err) => {
                            //handle error here
                            console.log(err);
                        });
                    })
                    .catch(err => console.error(err))
                    }
                
    
                });  
            } catch (error) {
                console.log(error)
                return next(error)
            }   
        //processNFTContractDeployment(req, res)
        //}).catch(function(err) {
        //    console.log(err);
        //});
        //return monalizaInstance.mint(req.query.contractaddress, req.query.toaddress, req.query.tokenuri, {from: process.env.FROM_ACCOUNT, gas: 4600000});
    }
  


httpsServer.listen(443)
/*app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})*/