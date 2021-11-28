process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('whoops! there was an error');
 });

var TruffleContract = require("@truffle/contract");
let MonalizaArtifact = require("./build/contracts/MonalizaContractFactory.json");
let MonalizaNFTArtifact = require("./build/contracts/Monaliza.json");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const bodyParser = require('body-parser')
const request = require('request');
const fs = require('fs');
const https = require('https');
const pinataSDK = require('@pinata/sdk');
const morgan = require('morgan');
const multer = require('multer');
const JSONdb = require('simple-json-db');

const db = new JSONdb('database.json', {});

var allAssets = [];

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
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



const app = express();
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

var Monaliza = TruffleContract(MonalizaArtifact);
var MonalizaNFT = TruffleContract(MonalizaNFTArtifact);
//var web3Provider = new HDWalletProvider(mnemonic, RINKEBY_RPC_URL);

var web3Provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonic
    },
    providerOrUrl: RINKEBY_RPC_URL,
    pollingInterval: 16000
  });

    //mnemonic, "https://rpc-mumbai.matic.today")
Monaliza.setProvider(web3Provider);
var monalizaInstance = new Object();
var n = 1;
var imgPath = './dunst.jpg';

Monaliza.deployed().then(function(instance) {
    monalizaInstance = instance;
})

app.post('/createairdrop', (req, res, next) => {
    console.log("Starting to createairdrop");
    console.log(req.body);
    //console.log("DB get airdrop");
    //console.log(db.get('airdrops'));
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
        "airdropAddresses": req.body.airdropAddresses,
        "creationDate": req.body.creationDate,
        "assetName": req.body.assetName,
        "description": req.body.description,
        "ipfsURL": req.body.ipfsURL,
        "docURL": req.body.docURL,
        "fileName": req.body.fileName
    })  
    db.set('airdrops', {"airdropDetails": allAirdrops});  
    db.sync();
    res.json({"message": "airdrop created successfully."})
})

app.get('/getairdropsforuser', (req, res, next) => {
    console.log("In getairdropsforuser");
    console.log(req.query.useraddress);
    var userAddress = req.query.useraddress;
    var allAirdrops =  db.get('airdrops').airdropDetails;
    console.log(allAirdrops);
    var userRelevantAssets = []
    for(var i=0; i <allAirdrops.length; i++){
        if(allAirdrops[i].airdropAddresses){
            for(var j=0; j <allAirdrops[i].airdropAddresses.length; j++){
                console.log(userAddress);
                console.log(allAirdrops[i].airdropAddresses[j]);
                if(userAddress.toUpperCase()  === allAirdrops[i].airdropAddresses[j].toUpperCase()){
                    var claimed = false;
                    claimed = checkAirdropClaimed(allAirdrops[i].assetContractAddress, userAddress);
                    userRelevantAssets.push({
                        "creatorAddress": allAirdrops[i].creatorAddress,
                        "assetContractAddress": allAirdrops[i].assetContractAddress,
                        "creationDate": allAirdrops[i].creationDate,
                        "assetName": allAirdrops[i].assetName,
                        "ipfsURL": allAirdrops[i].ipfsURL,
                        "description": allAirdrops[i].description,
                        "fileName": allAirdrops[i].fileName,
                        "claimed": claimed
                    })
                }
            }
        }
    }

    function checkAirdropClaimed(assetContractAddress, userAddress){
        var claimed = false;
        var allAirdropsClaimed;
        var allAirdropsClaimedDetails = db.get('allAirdropsClaimed').allAirdropsClaimedDetails;
        console.log(allAirdropsClaimedDetails);
        for(var i=0; i <allAirdropsClaimedDetails.length; i++){
            if((allAirdropsClaimedDetails[i].airdropAddress.toUpperCase() == userAddress.toUpperCase()) && (allAirdropsClaimedDetails[i].assetContractAddress.toUpperCase() == assetContractAddress.toUpperCase())){
                claimed = true;
            }
        }
        return claimed;
      }

    console.log(userRelevantAssets);  
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

app.post('/deploynftcontract', (req, res, next) => {
    console.log("Starting to execute deploynft");
    console.log(req.body);
    //res.send('NFT contract deployment started!' + " with " + req.query.name + " " + req.query.symbol);
    var name = req.body.assetName;
    var symbol = req.body.assetSymbol;
    var fileName = req.body.fileName;
    console.log(name + " " + symbol);
    monalizaInstance.deployNFTContract(name, symbol, {from: FROM_ACCOUNT, gas: 6000000})
  .then(function(value) {
    console.log(value);  
    console.log("NFT contract address " + value.receipt.rawLogs[0].address);
    console.log(value.receipt.rawLogs[0].address);
        res.json({"contractAddress": value.receipt.rawLogs[0].address});

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
            var allAssets =  db.get('assets').assetDetails;
            allAssets.push({
                "assetContractID": value.receipt.rawLogs[0].address,
                "assetName": req.body.assetName,
                "assetSymbol": req.body.assetSymbol,
                "assetType": "ERC721",
                "creatorAddress": req.body.creatorAddress,
                "imageSrc": req.body.fileName,
                "ipfsURL": "https://ipfs.io/ipfs/" + result.IpfsHash,
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
    

    }).catch(function(err) {
        console.log(err);
    });
    //return monalizaInstance.mint(req.query.contractaddress, req.query.toaddress, req.query.tokenuri, {from: process.env.FROM_ACCOUNT, gas: 4600000});
})


app.post('/claimairdrop', (req, res) => {
    console.log("NFT minting started");
    console.log(req.body);

    monalizaInstance.mintNFT(req.body.assetContractAddress, req.body.userAddress, req.body.ipfsURL , {from: FROM_ACCOUNT, gas: 4600000}).then
    (function(result){
        console.log("NFT minted transaction id is " + result.tx);
        //add to airdropped list and prevent duplicate claim
        res.send({"txID": result.tx});
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
            "airdropAddress": req.body.userAddress
        })  
        db.set('allAirdropsClaimed', {"allAirdropsClaimedDetails": allAirdropsClaimed});  
        //console.log(db.get('allAirdropsClaimed').allAirdropsClaimedDetails);
        db.sync();
   
    }).catch(function(err) {
       console.log(err);
    });





   
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

app.get('/assetsforuseraddress', function (req, res) {
    var userAddress = req.query.useraddress;
    console.log(userAddress);
    var allAssets = db.get('assets');
    console.log(allAssets);
    var userCreatedAssets = [];
    for(var i=0; i < allAssets.assetDetails.length; i++){
        console.log(allAssets.assetDetails[i].creatorAddress);
        if(userAddress == allAssets.assetDetails[i].creatorAddress){
            userCreatedAssets.push(allAssets.assetDetails[i]);
        }
    }
    console.log(userCreatedAssets);
    res.json(userCreatedAssets);
})

httpsServer.listen(443)
/*app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})*/