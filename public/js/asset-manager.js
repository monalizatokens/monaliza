//We can call contract function from browser as well, see link below
//https://ethereum.stackexchange.com/questions/25431/metamask-how-to-access-call-deployed-contracts-functions-using-metamask

var airdrops;
var msgHash;
var provider;
var validationStatus;
var airdropAddressesMode;
var currentAssetContractAddress;
var accountHere;

$( document ).ready(function() {
    //const Web3Modal = window.Web3Modal.default;
    "use strict";

    /**
     * Example JavaScript code that interacts with the page and Web3 wallets
     */
    
     // Unpkg imports
    const Web3Modal = window.Web3Modal.default;
    const WalletConnectProvider = window.WalletConnectProvider.default;
    const EvmChains = window.EvmChains;
    const Fortmatic = window.Fortmatic;
    const MewConnect = window.MewConnect;
    //const Metamask = window.Metamask;
    
    // Web3modal instance
    let web3Modal
    
    // Chosen wallet provider given by the dialog window
    //let provider;
    
    
    // Address of the selected account
    let selectedAccount;
    
    
    /**
     * Setup the orchestra
     */
    function init() {
    
      console.log("Initializing example");
      console.log("WalletConnectProvider is", WalletConnectProvider);
      console.log("Fortmatic is", Fortmatic);
    
      // Tell Web3modal what providers we have available.
      // Built-in web browser provider (only one can exist as a time)
      // like MetaMask, Brave or Opera is added automatically by Web3modal
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          host: "https://rpc-mumbai.maticvigil.com/v1/8c7e9f0faa20639a2e13c38697d43fb2c3812d40",
          options: {
            // Mikko's test key - don't copy as your mileage may vary
            infuraId: "4b594ff9f9b04517a0320d94bf150c24"
          }
        },
        mewconnect: {
            package: MewConnect, // required
            options: {
                infuraId: "8043bb2cf99347b1bfadfb233c5325c0"
            }
          },

        /*metamask: {
            package: Metamask,
            options: {
              // Mikko's test key - don't copy as your mileage may vary
              infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
            }
          },*/
    
        fortmatic: {
          package: Fortmatic,
          options: {
            // Mikko's TESTNET api key
            key: "pk_test_391E26A3B43A3350"
          }
        }
      };
    
      web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required,
        //network: "rinkeby",
        //network: "Matic Mumbai",
      });

      web3Modal.clearCachedProvider();
    
    }
    
    //init();
      async function onConnect() {

          console.log("Opening a dialog", web3Modal);
          try {
            provider = await web3Modal.connect();
            console.log(provider);
            getAccount();
            $(".connect-wallet-btn").html("Connected");
          } catch(e) {
            console.log("Could not get a wallet connection", e);
            return;
          }
        
          // Subscribe to accounts change
          provider.on("accountsChanged", (accounts) => {
            fetchAccountData();
          });
        
          // Subscribe to chainId change
          provider.on("chainChanged", (chainId) => {
            fetchAccountData();
          });
        
          // Subscribe to networkId change
          provider.on("networkChanged", (networkId) => {
            fetchAccountData();
          });
        
          //await refreshAccountData();
        }      

    var emailHere= ""

    /*$.showNotification({
        body:"<h3>" + "Please connect your wallet." + "</h3>",
        duration: 1200,
        maxWidth:"820px",
        shadow:"0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 100,
        margin:"5rem"
    });*/

    localStorage.setItem('fileName', ''); 
    localStorage.setItem('airdropAddressesFileName', ''); 
    
    console.log( "ready!" );
    $("#myProgress").hide();

    $("#fileuploaderform").submit(function(e){
        //$("#fileuploaderform").submit();
        //event.preventDefault()
        //onConnect();
        if(accountHere == ""){
            $.showNotification({
                body:"<h3>" + "File could not be uploaded. Please sign in first and upload again." + "</h3>",
                duration: 1200,
                maxWidth:"820px",
                shadow:"0 2px 6px rgba(0,0,0,0.2)",
                zIndex: 100,
                margin:"5rem"
            });
            return;
        }

        console.log("In fileupload handler")
        $.ajax( {
            url: '/fileupload',
            type: 'POST',
            data: new FormData( this ),
            processData: false,
            contentType: false,
            success: function(result){
                console.log(result);
                console.log($("#file-name"))
                $("#file-name").text(result.file.originalname);
                localStorage.setItem('airdropAddressesFileName', result.file.filename);  
                if(result.success == false){
                    $.showNotification({
                        body:"<h3>Please select a file.</h3>"
                  })
                }else {
                    localStorage.setItem('fileName', result.file.filename); 
                    //alert("File Uploaded successfully");    
                    $.showNotification({
                          body:"<h3>File Uploaded successfully</h3>"
                    })
                        
                    $("#fileuploadbutton").prop("value", "Re-upload");
                }
            }
          } );
          e.preventDefault();
    })
    
    $("#create-asset-btn").click(function()
        {
            var validationStatus = validateFields();
            console.log(validationStatus);
            if(validationStatus == true){
                var signedMessage;
                /*async function signMessage(){
                    console.log("signing now");
                    const web3Instance = new Web3(provider);
                    msgHash = web3Instance.utils.sha3(web3Instance.utils.toHex("test1"))
                    //if (!accountHere) return connect()
                    var sign = "";
                    web3Instance.eth.personal.sign(msgHash, accountHere, function (err, result) {
                        if (err) return console.error(err)
                        console.log('SIGNED:' + result)
                        sign = result;
                      })
    

                }*/

                //signMessage();
          
          
                /*web3Instance.eth.personal.sign(msgHash, accountHere, function (err, result) {
                    if (err) return console.error(err)
                    console.log('SIGNED:' + result)
                    sign = result;
                  })*/
    
                var contractAddress= "", assetName = "", docURL = "", description = "", addressses = []
    
                for(var i=0; i < $( ".whitelist" ).length; i++){
                    if($($( ".whitelist" )[i]).val() != ""){
                        addressses.push($($( ".whitelist" )[i]).val())
                    }
                    
                }
                console.log(addressses);
                var data = {
                    creatorAddress: accountHere,
                    fileName: localStorage.getItem("fileName"),
                    //contractAddress : "0x6aaeABe1c4762264216b194978E77b730501B1E9",
                    assetName: $("#assetName").val(),
                    assetSymbol: $("#assetSymbol").val(),
                    docURL: $("#docURL").val(),
                    description: $("#description").val(),
                    addresses: addressses,
                    sign: signedMessage
                }
                var url = "/deploynftcontract"
                
                $("#myProgress").show();
                startProgressBar();
                $(window).scrollTop(0);
                $.ajax({
                    type: "POST",
                    url: url,
                    // The key needs to match your method's input parameter (case-sensitive).
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        console.log(data.contractAddress);
                        $.showNotification({
                            body:"<h3>" + "Asset created successfully with NFT contract address: " + data.contractAddress + "</h3>",
                            duration: 12000,
                            maxWidth:"820px",
                            shadow:"0 2px 6px rgba(0,0,0,0.2)",
                            zIndex: 100,
                            margin:"1rem"
                        });
                        $("#myProgress").hide();
                    },
                    error: function(errMsg) {
                        console.log(errMsg);
                        $.showNotification({
                            body:"<h3>" + "Failed to deploy asset contract. Please try again." + "</h3>",
                            duration: 1200,
                            maxWidth:"820px",
                            shadow:"0 2px 6px rgba(0,0,0,0.2)",
                            zIndex: 100,
                            margin:"1rem"
                        });
                        $("#myProgress").hide();
                    }
                }); 
            }else{
                //Do nothing
            }
 
        }
    ) 

    function validateFields(){
        var validationStatus = true;
        var assetName = $("#assetName").val();
        var assetSymbol = $("#assetSymbol").val();
        //var docURL = $("#docURL").val();
        //var description = $("#description").val();
        if($(".sign-in-btn").html() == "Sign In"){
            validationStatus = false;
            $.showNotification({
                  body:"<h3>Please Sign In.</h3>"
            })
        }else
        if(localStorage.getItem('fileName') == ''){
            validationStatus = false;
            $.showNotification({
                body:"<h3>Please upload asset file.</h3>"
          })
        }
        else if(assetName == ''){
            validationStatus = false;
            $.showNotification({
                body:"<h3>Please enter Asset name.</h3>"
          })
        }else if(assetSymbol == ''){
            validationStatus = false;
            $.showNotification({
                body:"<h3>Please enter Asset symbol.</h3>"
          })
        }/*else if(assetSymbol == ''){
            validationStatus = false;
            $.showNotification({
                body:"<h3>Please enter Asset symbol.</h3>"
          })
        }  */
        return validationStatus;
    }

    function success(result, status){
        console.log("In success");
        console.log(result);
        console.log(status);
    }

    function startProgressBar(){
        var i = 0;
            //function move() {
            if (i == 0) {
                i = 1;
                var elem = document.getElementById("myBar");
                var width = 1;
                var id = setInterval(frame, 500);
                function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    i = 0;
                } else {
                    width++;
                    elem.style.width = width + "%";
                }
                }
            }
            //}
    }
      $(".sign-up-btn").click(function(){
        console.log("sign-up-btn clicked");

        if (!window.indexedDB) {
          console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
        $("#signup").show();

      })

    $("#signupsubmitbtn").click(function(){
        console.log("signupsubmitbtn clicked");
        var email = $("#useremail").val();
        var pin = $("#userpin").val();
        

        //var wallet = new ethers.Wallet("0x11231a28d2f5a7b0237a830e290133232ae1c6d2ab1552dee0fb06d264bcd515");
        //console.log("Address: " + wallet.address);
        //var req = indexedDB.deleteDatabase("UserDatabase");
        var request = window.indexedDB.open("UserDatabase", 1);

        request.onupgradeneeded = function(event) {
          var db = request.result;
          var store = db.createObjectStore("User", {keyPath: "email"});
          var index = store.createIndex("emailIndex", ["email"]);
        };

        request.onsuccess = function(event) {
          // Do something with request.result!
          console.log("success");
          console.log(event);
          // Start a new transaction
            var db = request.result;
            var tx = db.transaction("User", "readwrite");
            var store = tx.objectStore("User");
            console.log(store);
            //var index = store.index("emailIndex");
            console.log(email);
            // Add some data
            //store.put({"email": "georgesmith9914@gmail.com", "pubAddress": "abc", "pin": "", "privateKey": ""});

            //store.put({"email": email, "pubAddress": pubAddress, "pin": pin, "privateKey": pk});
            
            // Query the data
            var getPv = store.get(email);



            getPv.onsuccess = function() {
                //console.log(getPv.result);
                if(getPv.result){
                    $(".modal-body").append("<div><p style='color: red; padding-top: 2px;'>Wallet already exists for this email.</p></div>")
                }else{
                    var wallet = ethers.Wallet.createRandom();
                    console.log("Address: " + wallet.address);
                    var pubAddress = wallet.address;
                    var pk = wallet.privateKey;
                    store.put({"email": email, "pubAddress": pubAddress, "pin": pin, "privateKey": pk});
                    $("#signup").hide();
                    $.showNotification({
                      body:"<h3>Wallet created successfully with address " + pubAddress +  " . You can sign in now.</h3>"
                    })
                }  
                //$(".sign-up-in-btn").text("Sign out")
            };

           // Close the db when the transaction is done
            tx.oncomplete = function() {
                db.close();
            };
        };

        request.onerror = function(event) {
          // Do something with request.errorCode!
          console.log("error");
          console.log(event);
        };
    })

    $(".sign-in-btn").click(function(){
      console.log("sign-in-btn clicked");

      if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      }
      $("#signin").show();

    })

    $("#signinsubmitbtn").click(function(){
      console.log("signinsubmitbtn clicked");
      var email = $("#useremailforsignin").val();
      var pin = $("#userpinforsignin").val();
      

      //var wallet = new ethers.Wallet("0x11231a28d2f5a7b0237a830e290133232ae1c6d2ab1552dee0fb06d264bcd515");
      //console.log("Address: " + wallet.address);
      //var req = indexedDB.deleteDatabase("UserDatabase");
      var request = window.indexedDB.open("UserDatabase", 1);

      request.onupgradeneeded = function(event) {
        var db = request.result;
        var store = db.createObjectStore("User", {keyPath: "email"});
        var index = store.createIndex("emailIndex", ["email"]);
      };

      request.onsuccess = function(event) {
        // Do something with request.result!
        console.log("success");
        console.log(event);
        // Start a new transaction
          var db = request.result;
          var tx = db.transaction("User", "readwrite");
          var store = tx.objectStore("User");
          console.log(store);
          //var index = store.index("emailIndex");
          console.log(email);
          // Add some data
          //store.put({"email": "georgesmith9914@gmail.com", "pubAddress": "abc", "pin": "", "privateKey": ""});

          //store.put({"email": email, "pubAddress": pubAddress, "pin": pin, "privateKey": pk});
          
          // Query the data
          var getPv = store.get(email);



          getPv.onsuccess = function() {
              //console.log(getPv.result);
              accountHere = getPv.result.pubAddress;
              console.log(accountHere);
              emailHere = email;
              if(getPv.result){
                if(getPv.result.pin == pin){
                  $("#signin").hide();
                  $(".sign-in-btn").text("Sign Out");
                  $.showNotification({
                    body:"<h3>Successfully authenticated. Your address is " + getPv.result.pubAddress  +" .</h3>"
                  })

                  if( window.location.pathname.includes("claim.html")){
                    loadClaimableAirdrops(getPv.result.pubAddress);
                  }else if(window.location.pathname.includes("airdrop.html")){
                    getAssets(getPv.result.pubAddress);
                  }
                }
              }else{
                $(".modal-body").append("<div><p style='color: red; padding-top: 2px;'>Invalid email/PIN.</p></div>")

              }  
              //$(".sign-up-in-btn").text("Sign out")
          };

         // Close the db when the transaction is done
          tx.oncomplete = function() {
              db.close();
          };
      };

      request.onerror = function(event) {
        // Do something with request.errorCode!
        console.log("error");
        console.log(event);
      };
  })


    $(".connect-wallet-btn").click(function(){
        console.log("create-asset-connect-wallet-btn clicked");
        /*if (window.ethereum) {
            handleEthereum();
          } else {
            window.addEventListener('ethereum#initialized', handleEthereum, {
              once: true,
            });
          
            // If the event is not dispatched by the end of the timeout,
            // the user probably doesn't have MetaMask installed.
            setTimeout(handleEthereum, 3000); // 3 seconds
          }*/
                  
              onConnect();

            function handleEthereum() {
                const { ethereum } = window;
                if (ethereum && ethereum.isMetaMask) {
                console.log('Ethereum successfully detected!');
                // Access the decentralized web!
                getAccount();
                $(".connect-wallet-btn").html("Connected");
                } else {
                    alert("Please install MetaMask");
                console.log('Please install MetaMask!');
                }
            }
        /*if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            getAccount();
            $(this).html("Connected");
            
        }else{
            alert("Please install Metamask.");
        }*/
    })

    $("#create-airdrop-btn").click(function(){
            console.log("create-airdrop-btn clicked");
            if($(".connect-wallet-btn").html() == "Connect Wallet"){
                validationStatus = false;
                $.showNotification({
                      body:"<h3>Connect Metamask wallet.</h3>"
                })
                return;
            }else if($("#assetList > option").length < 1){
                console.log("No asset selection done");
                $.showNotification({
                    body:"<h3>" + "Please select an asset (or create an asset using Create menu if you haven't created already)." + "</h3>",
                    duration: 1200,
                    maxWidth:"820px",
                    shadow:"0 2px 6px rgba(0,0,0,0.2)",
                    zIndex: 100,
                    margin:"5rem"
                });
                return;
            }else if(checkEmptyAddressRows()){
                console.log("Doing checkEmptyAddressRows");
                $.showNotification({
                    body:"<h3>" + "Please make sure there are no empty airdrop addresses or use a csv file to upload addresses." + "</h3>",
                    duration: 1200,
                    maxWidth:"820px",
                    shadow:"0 2px 6px rgba(0,0,0,0.2)",
                    zIndex: 100,
                    margin:"5rem"
                });
                return;
            }else{
                console.log("came in else");
                var airdropAddressesFileName;
                var airDropAddresses = [];
                if($( "#addressTable " ).hasClass( "invisible" )){
                    airdropAddressesMode = "file";
                    airdropAddressesFileName = localStorage.getItem("airdropAddressesFileName");
                }else{
                    $('#addressTable >tbody >tr').each(function() {
                        airdropAddressesMode = "manualEntry";
                        var address = $(this).find("td:eq(0)  input[type='text']").val();
                        airDropAddresses.push(address);    
                    })
                }    

 
                //Get file name of asset image on disk
                //Get NFT contract address of asset
                //Make Ajax call to mintnft() post method
                var data = {
                    "creatorAddress": accountHere,
                    "assetContractAddress": $("#assetList > option")[0].id,
                    "airdropAddressesMode": airdropAddressesMode,
                    "airdropAddressesFileName": airdropAddressesFileName,
                    "airdropAddresses": airDropAddresses,
                    "creationDate": new Date(),
                    "assetName": $("#assetList > option")[0].text,
                    "description": $("#assetList option:selected").attr("description"),
                    "ipfsURL": $("#assetList option:selected").attr("ipfsURL"),
                    "fileName": $("#assetList option:selected").attr("filename")
                }
                $.ajax( {
                    url: '/createairdrop',
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(result){
                        console.log(result);
                        if(result){
                            $.showNotification({
                                body:"<h3>Airdrop created successfully.</h3>"
                          })
                        }else {
                            $.showNotification({
                                  body:"<h3>Airdrop couldn't be created. Please try again.</h3>"
                            })
                        }
                    }
                  } );
            }
    
    })

    
    function checkEmptyAddressRows(){
        var emptyAddressRows = false;
        if(airdropAddressesMode == "file"){
            if(localStorage.getItem("airdropAddressesFileName")){
                emptyAddressRows = false
            }else{
                emptyAddressRows = true
            }
        }else{
            var rowCount = $('#addressTable >tbody >tr').length;
            $('#addressTable >tbody >tr').each(function() {
                var address = $(this).find("td:eq(0)  input[type='text']").val();
                console.log(address);
                if(address == '') emptyAddressRows = true;
            })
            console.log(emptyAddressRows);
        }
         
        return emptyAddressRows;
    }

    $(".col-sm-12").on("click", ".claim-airdrop-btn", function(){
        console.log("claim-airdrop-btn clicked");
        console.log($( this ).hasClass("disabled"));
        if($( this ).hasClass("disabled")) return;
        //ASK USER TO SIGN A MESSAGE
        //async function signMessage(){
            var assetContractAddress = $( this ).attr("assetcontractaddress");
            var ipfsURL = $( this ).attr("ipfsurl");
            const web3Instance = new Web3(provider);
            var buttonThis = this;
            //msgHash = web3Instance.utils.sha3(web3Instance.utils.toHex("claimairdrop"), {encoding: "hex"})
            var msg = "I am claiming airdrop.";
            //msgHash = web3Instance.utils.sha3("claimairdrop")
            //if (!accountHere) return connect()
            //var sign = "";
            //web3Instance.eth.personal.sign(msgHash, accountHere, function (err, result) {
            //web3Instance.eth.personal.sign(msg, accountHere, function (err, result) {
                //if (err) return console.error(err)
                //console.log('SIGNED:' + result)
                //sign = result;

                    //Claim airdrop after signing
                    
                    if($( this ).hasClass("disabled") != true){
                        //console.log($( this ).attr("assetcontractaddress"));
                        //if($(".connect-wallet-btn").html() == "Connect Wallet"){
                          if($(".connect-wallet-btn").html() == "Connect Wallet"){
                            validationStatus = false;
                            $.showNotification({
                                body:"<h3>Connect Metamask wallet.</h3>"
                            })
                            return;
                        }else{
                            console.log("came in else");
                            $(buttonThis).prop('disabled', true);
                            var claimData = {
                                "userAddress": accountHere,
                                "assetContractAddress": assetContractAddress,
                                "ipfsURL": ipfsURL,
                                "msg": msg,
                                "sign": ""
                            }
                            $("#myProgress").show();
                            $(window).scrollTop(0);
                            startProgressBar();
                            $.ajax( {
                                url: '/claimairdrop',
                                type: 'POST',
                                data: JSON.stringify(claimData),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function(result){
                                    console.log(result);
                                    if(result.assetContractID && result.tokenID){
                                        $("#myProgress").hide();
                                        $.showNotification({
                                            duration: 12000,
                                            body:"<h3>Airdrop claimed successfully. Add asset to Metamask with contract address " + claimData.assetContractAddress  + "</h3>"
                                    })
                                    $("." + assetContractAddress).find(".nft-token-id").html('<small>NFT Token ID: '    + result.tokenID +  '</small>');
                                    }else {
                                        $.showNotification({
                                            body:"<h3>Airdrop couldn't be claimed. Please try again.</h3>"
                                        })
                                        $("#myProgress").hide();
                                    }
                                }
                            } );
                        }
                    }

              //})


        //}

        //signMessage();    



    })



    async function getAccount() {
        //const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(provider);
        const chainId = await web3.eth.getChainId();
        //const networkType = await web3.eth.get
        console.log(evmChains.getChain(chainId));
        $.showNotification({
            body:"<h3>" + "Connected to chain " + evmChains.getChain(chainId).chain + " with chain ID " + evmChains.getChain(chainId).chainId + " on network " + evmChains.getChain(chainId).network + ".</h3>"
        })
        const accounts = await web3.eth.getAccounts();

        const account = accounts[0];
        //accountHere = account;
        console.log(account);
        //alert(account);
        //getAssets(account);
        //loadClaimableAirdrops(account);
        if( window.location.pathname.includes("claim.html")){
            loadClaimableAirdrops(account);
        }else if(window.location.pathname.includes("airdrop.html")){
            getAssets(account);
        }
    }

    function getAssets(account){
        var assets = []
        $.ajax({url: "/assetsforuseraddress?useraddress=" + accountHere, success: function(result){
          console.log(result);
          assets = result;
          var listContainer = $('#assetList');  
          for(var assetCounter=0; assetCounter <assets.length; assetCounter ++){
            console.log(assetCounter);  
            listContainer.prepend('<option id=' + '"' + assets[assetCounter].assetContractID + '"'  + ' description=' + '"' + assets[assetCounter].description + '"'  + ' ipfsURL=' + '"' + assets[assetCounter].ipfsURL + '"' + ' docURL=' + '"' + assets[assetCounter].docURL + '"'    + ' fileName=' + '"' + assets[assetCounter].imageSrc + '"> ' + assets[assetCounter].assetName + '</option>');
          }
        }});
    }

    function loadClaimableAirdrops(account){
       // alert("loadClaimableAirdrops");
       if($(location).attr('href').includes("claim")){
            $.ajax({url: "/getairdropsforuser?useraddress=" + account, success: function(result){
                console.log(result);
                airdrops = result.reverse();
                //var listContainer = $('#assetList');  
                /*for(var assetCounter=0; assetCounter <assets.length; assetCounter ++){
                console.log(assetCounter);  
                listContainer.prepend('<option id=' + '"' + assets[assetCounter].assetContractID + '"'  + ' fileName=' + '"' + assets[assetCounter].imageSrc + '"> ' + assets[assetCounter].assetName + '</option>');
                }*/
                $($(".connect-wallet-first")[0]).remove();
                var input = result;

                    function groupByThree([a,b,c,...rest]){
                        if (rest.length === 0) return [[a,b,c].filter(x => x!==undefined)]
                        return [[a,b,c]].concat(groupByThree(rest))
                    }

                console.log(groupByThree(input))


                const sumDigits = (num) => {
                    let sum = 0;
                    while (num) {
                      sum += num % 10;
                      num = Math.floor(num / 10);
                    }
                    return sum;
                  };
                  
                  const isMultipleOfThree = (num) => {
                    let sumOfDigits = sumDigits(num);
                    return (
                      sumOfDigits === 0 ||
                      sumOfDigits === 3 ||
                      sumOfDigits === 6 ||
                      sumOfDigits === 9
                    );
                  };
                  
                  for (let i = 0; i <= 30; i++) {
                    if (isMultipleOfThree(i)) {
                      console.log(i);
                    }
                  }
                
                var airdroppedAssetsGroupofThree = groupByThree(input); 
                console.log(airdroppedAssetsGroupofThree); 
                for(var counter=0; counter < 1; counter++){
                //for(var counter=0; counter < airdroppedAssetsGroupofThree.length; counter++){
                    /*$($(".col-sm-8")[0]).append(addCardDeck());
                    console.log(airdroppedAssetsGroupofThree[counter].length);
                    for(var innerCounter=0; innerCounter < airdroppedAssetsGroupofThree[counter].length; innerCounter++){
                        console.log("In inner for loop");
                        $($(".card-deck")[batchThreeCounter]).append(addCard());
                    } */ 
                    $($(".col-sm-12")[0]).append(addCardDeck());
                    for(var innerCounterTwo=0; innerCounterTwo < airdroppedAssetsGroupofThree[counter].length; innerCounterTwo++){
                        console.log("In inner for loop");
                        //console.log(airdroppedAssetsGroupofThree[counter][innerCounterTwo]);
                        $($(".card-deck")[counter]).append(addCard(airdroppedAssetsGroupofThree[counter][innerCounterTwo], account));
                    }     
 
                }   

                /*if(airdropAssetCount <= 3){
                    console.log(airdropAssetCount);
                    //$($(".col-sm-8")[0]).append(addCardDeck());
                    //$($(".card-deck")[0]).append(addCard());
                    //$($(".card-deck")[0]).append(addCard());
                    $($(".col-sm-8")[0]).append(addCardDeck());
                   for(var counter=0; counter < airdropAssetCount; counter++){
                        console.log("In for loop");
                        $($(".card-deck")[0]).append(addCard());
                    }                        


                }else if(airdropAssetCount > 3 && airdropAssetCount <=6){

                }*/
    
            }});
    
            

        } 

    }

    $("#nftRecipientEmailFirstTime").focusin(function() {
      $("#labelNftRecipientEmailSecondTime").css("display", "inline")
      $("#nftRecipientEmailSecondTime").css("display", "inline")
    })

    $("#sendnftbyemailbutton").click(async function() {
      console.log("sendnftbyemailbutton clicked");
      var assetContractID = $("#sendnftbyemailmodal").attr("assetContractID");
      var email = $("#nftRecipientEmailFirstTime").val();
      var url = "/findpublicaddressbyemail";
      var data = {
        "email": email
      }
        $.ajax({
          type: "POST",
          url: url,
          // The key needs to match your method's input parameter (case-sensitive).
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: async function(data){
                var request = window.indexedDB.open("UserDatabase", 1);

                request.onupgradeneeded = function(event) {
                  var db = request.result;
                  var store = db.createObjectStore("User", {keyPath: "email"});
                  var index = store.createIndex("emailIndex", ["email"]);
                };
          
                request.onsuccess = function(event) {
                  // Do something with request.result!
                  console.log("success");
                  console.log(event);
                  // Start a new transaction
                    var db = request.result;
                    var tx = db.transaction("User", "readwrite");
                    var store = tx.objectStore("User");
                    console.log(store);
                    //var index = store.index("emailIndex");
                    console.log(email);
                    // Add some data
                    //store.put({"email": "georgesmith9914@gmail.com", "pubAddress": "abc", "pin": "", "privateKey": ""});
          
                    //store.put({"email": email, "pubAddress": pubAddress, "pin": pin, "privateKey": pk});
                    
                    // Query the data
                    var getPv = store.get(emailHere);
          
          
          
                    getPv.onsuccess = function() {
                        //console.log(getPv.result);
                        if(getPv.result){
                          const ethersProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
                          console.log(ethersProvider);
                          const ethersSigner = new ethers.Wallet(getPv.result.privateKey, ethersProvider);
                          console.log(ethersSigner);
                          //var balance = await ethersProvider.getBalance("0x5Bd46de6E8d4e8Ba0fdd76ACC8d543bA07b58dE5")
                          //console.log(balance);
                          const mContract = new ethers.Contract(assetContractID, ctrABI.abi, ethersProvider);
                          const mContractWithSigner = mContract.connect(ethersSigner);
                          console.log(mContractWithSigner);
                          var gasFeeOptions = {gasLimit: 2100000, gasPrice: 8000000000}
                          var tx = mContractWithSigner.approve(data.publicAddress, 1 , gasFeeOptions)
                          console.log("ethers tx");
                          console.log(tx);
                          tx.then(function(value) {
                              console.log(value);
                              var tx2 = mContractWithSigner.transferFrom(getPv.result.pubAddress, data.publicAddress, 1 , gasFeeOptions)
                              tx2.then(function(value) {
                                  console.log(value);
                                  $("#sendnftbyemailmodal").hide();
                                  $(".modal-backdrop").remove()
                                  $.showNotification({
                                    body:"<h3>" + "NFT transferred to : " + data.publicAddress + " via transaction code " + value.hash +  "</h3>",
                                    duration: 12000,
                                    maxWidth:"820px",
                                    shadow:"0 2px 6px rgba(0,0,0,0.2)",
                                    zIndex: 100,
                                    margin:"1rem"
                                });
                              })
                          })
                        }else{

                        }  
                        //$(".sign-up-in-btn").text("Sign out")
                    };
          
                  // Close the db when the transaction is done
                    tx.oncomplete = function() {
                        db.close();
                    };
                };
          
                request.onerror = function(event) {
                  // Do something with request.errorCode!
                  console.log("error");
                  console.log(event);
                };
 

              /*$.showNotification({
                  body:"<h3>" + "Asset created successfully with NFT contract address: " + data.contractAddress + "</h3>",
                  duration: 12000,
                  maxWidth:"820px",
                  shadow:"0 2px 6px rgba(0,0,0,0.2)",
                  zIndex: 100,
                  margin:"1rem"
              }); */

          },
          error: function(errMsg) {
              console.log(errMsg);
              /*$.showNotification({
                  body:"<h3>" + "Failed to deploy asset contract. Please try again." + "</h3>",
                  duration: 1200,
                  maxWidth:"820px",
                  shadow:"0 2px 6px rgba(0,0,0,0.2)",
                  zIndex: 100,
                  margin:"1rem"
              }); */

          }
      }); 
    })

    

});

function childrenRow() {
    /*var table = document.getElementById("childTable");
    var row = table.insertRow(2);
    //var cell1 = row.insertCell(0);
    $('#childTable tbody tr').addClass("form-control");*/
    $("#addressTable").find('tbody')
    .append($('<tr>')
        .append($('<td>')
            .append($('<input>')
                .attr('type', 'text')
                .attr('class', 'form-control')
                //.class('form-control')
            )
        )
    );
 }

function addCardDeck(){
    var cardDeck = 
    '<div class="card-deck mt-5">' +
    '</div>'
    return cardDeck;
}

 function addCard(assetDetails, userAccount){
     console.log(assetDetails);
     var assetDescription;
     if(assetDetails.description){
        assetDescription = assetDetails.description
     }else {
        assetDescription = ''
     }

     var formatDate = function(date) {
        return date.getDate() + "-" + (date.getMonth() + 1)  + "-" + date.getFullYear();
      }
      
      var timestamp = assetDetails.creationDate;
      var date = formatDate(new Date(timestamp));
      console.log(date);

      var buttonState = " disabled";
      var transferButtonState = " enabled";
      var buttonText = "Already claimed"
      var transferButtonText = "Send by Email"
      //currentAssetContractAddress = assetDetails.assetContractAddress;
      var assetContractAddressLocal = assetDetails.assetContractAddress 
      var transferButtonHTML = '<button  ' + ' assetContractAddress=' +  '"' + assetDetails.assetContractAddress + '"' + ' tokenID=' +  '"' + assetDetails.tokenID + '"'  + ' userAddress=' + '"' + userAccount  + '"' + ' onclick=' + '"' + "transferTokenbyEmail(" + "'" + assetContractAddressLocal + "'" + "" + "," + assetDetails.tokenID + ")"  + '"'  + ' ipfsURL=' + '"' + assetDetails.ipfsURL  + '"'  + '  class="btn btn-primary btn-lg mt-3 transfer-token-btn ' +  transferButtonState +  '">' +  transferButtonText + '</button>'
      if(! assetDetails.claimed){
        buttonState = "";
        buttonText = "Claim"
        transferButtonHTML = ""
      }
     var assetTokenID =  assetDetails.tokenID == undefined ? '' : assetDetails.tokenID;
     var uniqueCardID = assetDetails.assetContractAddress + assetTokenID;
     var card = 
        '<div class="card ' + uniqueCardID + '">' +
            //'<img class="card-img-top"  src="' + "/uploads/" + assetDetails.fileName + '" alt="Card image cap">' +
            '<video class="card-img-top"  src="' + "/uploads/" + assetDetails.fileName + '" alt="Card image cap" autoplay controls></video>' +
            '<div class="card-body">' +
            '<h5 class="card-title">'  +  assetDetails.assetName + '</h5>' +
            '<p class="card-text">'  + assetDescription  +  '</p>' +
            '<p class="card-text nft-contract-address"><small>NFT Contract Address: '  + assetDetails.assetContractAddress  +  '</small></p>' +
            '<p class="card-text nft-token-id"><small>NFT Token ID: '    + assetTokenID  +  '</small></p>' +
            '</div>' +
            '<div class="card-footer">' +
            '<small class="text-muted">' + "Airdropped on " + date  + '</small>' +
            //'<div class="container">' +
                '<div class="text-center mt-3">' +
                    '<button  ' + ' assetContractAddress=' +  '"' + assetDetails.assetContractAddress + '"'  + ' userAddress=' + '"' + userAccount  + '"'  + ' ipfsURL=' + '"' + assetDetails.ipfsURL  + '"'  + ' type="submit" class="btn btn-primary btn-lg mt-3 claim-airdrop-btn ' +  buttonState +  '">' +  buttonText + '</button>' +  
                    transferButtonHTML +  
                '</div>' +   
              //  '</div>' +
            '</div>' +
        '</div>'
    return card;
 }

 async function transferTokenbyEmail(localAssetContractID, tokenID){
     console.log("transfer requested");
     console.log(localAssetContractID);
     console.log(tokenID);
     //Execute transfer function for a specific token on NFT contract
     $('#sendnftbyemailmodal').modal();
     $("#sendnftbyemailmodal").attr("assetContractID", localAssetContractID)
     $("#sendnftbyemailmodal").attr("tokenID", tokenID)
     //var recipientEmail = $("#nftRecipientEmailFirstTime").val();

    /*const ethersProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
    console.log(ethersProvider);
    const ethersSigner = new ethers.Wallet("a8f45b06d108bc5d30f3883979302d46f627d19ac192931049d75c377bf818bf", ethersProvider);
    console.log(ethersSigner);
    var balance = await ethersProvider.getBalance("0x5Bd46de6E8d4e8Ba0fdd76ACC8d543bA07b58dE5")
    console.log(balance);
    const mContract = new ethers.Contract("0xf4022AFbA964323569cC13dc6e025ac6ad2CB13B", ctrABI.abi, ethersProvider);
    const mContractWithSigner = mContract.connect(ethersSigner);
    console.log(mContractWithSigner);
    var gasFeeOptions = {gasLimit: 2100000, gasPrice: 8000000000}
    var tx = mContractWithSigner.approve("0x15a2AD79Cfe458A5BB2b061CCfc99426122Ac46a", 1 , gasFeeOptions)
    console.log("ethers tx");
    console.log(tx);
    tx.then(function(value) {
        console.log(value);
        var tx2 = mContractWithSigner.transferFrom("0x5Bd46de6E8d4e8Ba0fdd76ACC8d543bA07b58dE5", "0x15a2AD79Cfe458A5BB2b061CCfc99426122Ac46a", 1 , gasFeeOptions)
        tx2.then(function(value) {
            console.log(value);
        })
    })*/

  
 }
 function decimalToHex(d) {
    return (+d).toString(16);
}

 const ctrABI = {
    "_format": "hh-sol-artifact-1",
    "contractName": "Monaliza",
    "sourceName": "contracts/MonalizaFactory.sol",
    "abi": [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "tokenName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "_proxyRegistryAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "approved",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "ApprovalForAll",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address payable",
            "name": "relayerAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "functionSignature",
            "type": "bytes"
          }
        ],
        "name": "MetaTransactionExecuted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "ERC712_VERSION",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_tokenURI",
            "type": "string"
          }
        ],
        "name": "_setTokenURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "allowedAddresses",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "baseTokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "contractURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "functionSignature",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "sigR",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "sigS",
            "type": "bytes32"
          },
          {
            "internalType": "uint8",
            "name": "sigV",
            "type": "uint8"
          }
        ],
        "name": "executeMetaTransaction",
        "outputs": [
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "getApproved",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getChainId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getDomainSeperator",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getNonce",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "getTokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "isAddressAllowed",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          }
        ],
        "name": "isApprovedForAll",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "mintTo",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "addressesAllowedForMinting",
            "type": "address[]"
          }
        ],
        "name": "setAddressesAllowedForMinting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "tokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "bytecode": "0x60806040526000600660006101000a81548160ff0219169083151502179055503480156200002c57600080fd5b50604051620046e2380380620046e2833981810160405281019062000052919062000542565b828282828281600090805190602001906200006f92919062000409565b5080600190805190602001906200008892919062000409565b505050620000ab6200009f6200012060201b60201c565b6200013c60201b60201c565b80600b60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555062000103600a6200020260201b620017481760201c565b62000114836200021860201b60201c565b50505050505062000847565b6000620001376200029a60201b6200175e1760201c565b905090565b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6001816000016000828254019250508190555050565b600660009054906101000a900460ff16156200026b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000262906200068b565b60405180910390fd5b6200027c816200034d60201b60201c565b6001600660006101000a81548160ff02191690831515021790555050565b60003073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156200034657600080368080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509050600080369050905073ffffffffffffffffffffffffffffffffffffffff8183015116925050506200034a565b3390505b90565b6040518060800160405280604f815260200162004693604f91398051906020012081805190602001206040518060400160405280600181526020017f31000000000000000000000000000000000000000000000000000000000000008152508051906020012030620003c4620003fc60201b60201c565b60001b604051602001620003dd9594939291906200062e565b6040516020818303038152906040528051906020012060078190555050565b6000804690508091505090565b828054620004179062000799565b90600052602060002090601f0160209004810192826200043b576000855562000487565b82601f106200045657805160ff191683800117855562000487565b8280016001018555821562000487579182015b828111156200048657825182559160200191906001019062000469565b5b5090506200049691906200049a565b5090565b5b80821115620004b55760008160009055506001016200049b565b5090565b6000620004d0620004ca84620006e1565b620006ad565b905082815260208101848484011115620004e957600080fd5b620004f684828562000763565b509392505050565b6000815190506200050f816200082d565b92915050565b600082601f8301126200052757600080fd5b815162000539848260208601620004b9565b91505092915050565b6000806000606084860312156200055857600080fd5b600084015167ffffffffffffffff8111156200057357600080fd5b620005818682870162000515565b935050602084015167ffffffffffffffff8111156200059f57600080fd5b620005ad8682870162000515565b9250506040620005c086828701620004fe565b9150509250925092565b620005d58162000725565b82525050565b620005e68162000739565b82525050565b6000620005fb600e8362000714565b91507f616c726561647920696e697465640000000000000000000000000000000000006000830152602082019050919050565b600060a082019050620006456000830188620005db565b620006546020830187620005db565b620006636040830186620005db565b620006726060830185620005ca565b620006816080830184620005db565b9695505050505050565b60006020820190508181036000830152620006a681620005ec565b9050919050565b6000604051905081810181811067ffffffffffffffff82111715620006d757620006d6620007fe565b5b8060405250919050565b600067ffffffffffffffff821115620006ff57620006fe620007fe565b5b601f19601f8301169050602081019050919050565b600082825260208201905092915050565b6000620007328262000743565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60005b838110156200078357808201518184015260208101905062000766565b8381111562000793576000848401525b50505050565b60006002820490506001821680620007b257607f821691505b60208210811415620007c957620007c8620007cf565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620008388162000725565b81146200084457600080fd5b50565b613e3c80620008576000396000f3fe6080604052600436106101cd5760003560e01c80636352211e116100f75780639deecd3811610095578063d547cfb711610064578063d547cfb7146106c7578063e8a3d485146106f2578063e985e9c51461071d578063f2fde38b1461075a576101cd565b80639deecd381461060f578063a22cb46514610638578063b88d4fde14610661578063c87b56dd1461068a576101cd565b8063755edd17116100d1578063755edd171461053f5780638da5cb5b1461057c5780638fa2a903146105a757806395d89b41146105e4576101cd565b80636352211e146104ae57806370a08231146104eb578063715018a614610528576101cd565b806318160ddd1161016f5780633408e4701161013e5780633408e470146103e05780633bb3a24d1461040b5780634120657a1461044857806342842e0e14610485576101cd565b806318160ddd1461032457806320379ee51461034f57806323b872dd1461037a5780632d0335ab146103a3576101cd565b8063081812fc116101ab578063081812fc14610263578063095ea7b3146102a05780630c53c51c146102c95780630f7e5970146102f9576101cd565b806301538868146101d257806301ffc9a7146101fb57806306fdde0314610238575b600080fd5b3480156101de57600080fd5b506101f960048036038101906101f49190612b9a565b610783565b005b34801561020757600080fd5b50610222600480360381019061021d9190612af6565b61080e565b60405161022f9190613590565b60405180910390f35b34801561024457600080fd5b5061024d6108f0565b60405161025a9190613672565b60405180910390f35b34801561026f57600080fd5b5061028a60048036038101906102859190612b71565b610982565b60405161029791906134eb565b60405180910390f35b3480156102ac57600080fd5b506102c760048036038101906102c29190612a79565b610a07565b005b6102e360048036038101906102de91906129ea565b610b1f565b6040516102f09190613650565b60405180910390f35b34801561030557600080fd5b5061030e610d91565b60405161031b9190613672565b60405180910390f35b34801561033057600080fd5b50610339610dca565b60405161034691906138f4565b60405180910390f35b34801561035b57600080fd5b50610364610de7565b60405161037191906135ab565b60405180910390f35b34801561038657600080fd5b506103a1600480360381019061039c91906128e4565b610df1565b005b3480156103af57600080fd5b506103ca60048036038101906103c5919061287f565b610e51565b6040516103d791906138f4565b60405180910390f35b3480156103ec57600080fd5b506103f5610e9a565b60405161040291906138f4565b60405180910390f35b34801561041757600080fd5b50610432600480360381019061042d9190612b71565b610ea7565b60405161043f9190613672565b60405180910390f35b34801561045457600080fd5b5061046f600480360381019061046a919061287f565b610f4c565b60405161047c9190613590565b60405180910390f35b34801561049157600080fd5b506104ac60048036038101906104a791906128e4565b610f6c565b005b3480156104ba57600080fd5b506104d560048036038101906104d09190612b71565b610f8c565b6040516104e291906134eb565b60405180910390f35b3480156104f757600080fd5b50610512600480360381019061050d919061287f565b61103e565b60405161051f91906138f4565b60405180910390f35b34801561053457600080fd5b5061053d6110f6565b005b34801561054b57600080fd5b506105666004803603810190610561919061287f565b61117e565b60405161057391906138f4565b60405180910390f35b34801561058857600080fd5b50610591611227565b60405161059e91906134eb565b60405180910390f35b3480156105b357600080fd5b506105ce60048036038101906105c9919061287f565b611251565b6040516105db9190613590565b60405180910390f35b3480156105f057600080fd5b506105f96112a7565b6040516106069190613672565b60405180910390f35b34801561061b57600080fd5b5061063660048036038101906106319190612ab5565b611339565b005b34801561064457600080fd5b5061065f600480360381019061065a91906129ae565b6113f4565b005b34801561066d57600080fd5b5061068860048036038101906106839190612933565b61140a565b005b34801561069657600080fd5b506106b160048036038101906106ac9190612b71565b61146c565b6040516106be9190613672565b60405180910390f35b3480156106d357600080fd5b506106dc61149c565b6040516106e99190613672565b60405180910390f35b3480156106fe57600080fd5b5061070761152e565b6040516107149190613672565b60405180910390f35b34801561072957600080fd5b50610744600480360381019061073f91906128a8565b61154e565b6040516107519190613590565b60405180910390f35b34801561076657600080fd5b50610781600480360381019061077c919061287f565b611650565b005b61078c8261180f565b6107cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107c290613834565b60405180910390fd5b80600d600084815260200190815260200160002090805190602001906107f29291906125ce565b5080600c90805190602001906108099291906125ce565b505050565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806108d957507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806108e957506108e88261187b565b5b9050919050565b6060600080546108ff90613b95565b80601f016020809104026020016040519081016040528092919081815260200182805461092b90613b95565b80156109785780601f1061094d57610100808354040283529160200191610978565b820191906000526020600020905b81548152906001019060200180831161095b57829003601f168201915b5050505050905090565b600061098d8261180f565b6109cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c390613814565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000610a1282610f8c565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610a83576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a7a906138b4565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610aa26118e5565b73ffffffffffffffffffffffffffffffffffffffff161480610ad15750610ad081610acb6118e5565b61154e565b5b610b10576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0790613794565b60405180910390fd5b610b1a83836118f4565b505050565b606060006040518060600160405280600860008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205481526020018873ffffffffffffffffffffffffffffffffffffffff168152602001878152509050610ba287828787876119ad565b610be1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bd890613894565b60405180910390fd5b610c346001600860008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611ab690919063ffffffff16565b600860008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f5845892132946850460bff5a0083f71031bc5bf9aadcd40f1de79423eac9b10b873388604051610caa93929190613506565b60405180910390a16000803073ffffffffffffffffffffffffffffffffffffffff16888a604051602001610cdf929190613475565b604051602081830303815290604052604051610cfb919061345e565b6000604051808303816000865af19150503d8060008114610d38576040519150601f19603f3d011682016040523d82523d6000602084013e610d3d565b606091505b509150915081610d82576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d79906136d4565b60405180910390fd5b80935050505095945050505050565b6040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525081565b60006001610dd8600a611acc565b610de29190613a70565b905090565b6000600754905090565b610e02610dfc6118e5565b82611ada565b610e41576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e38906138d4565b60405180910390fd5b610e4c838383611bb8565b505050565b6000600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000804690508091505090565b6060600d60008381526020019081526020016000208054610ec790613b95565b80601f0160208091040260200160405190810160405280929190818152602001828054610ef390613b95565b8015610f405780601f10610f1557610100808354040283529160200191610f40565b820191906000526020600020905b815481529060010190602001808311610f2357829003601f168201915b50505050509050919050565b600e6020528060005260406000206000915054906101000a900460ff1681565b610f878383836040518060200160405280600081525061140a565b505050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611035576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161102c906137d4565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156110af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110a6906137b4565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6110fe6118e5565b73ffffffffffffffffffffffffffffffffffffffff1661111c611227565b73ffffffffffffffffffffffffffffffffffffffff1614611172576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161116990613854565b60405180910390fd5b61117c6000611e14565b565b60006111886118e5565b73ffffffffffffffffffffffffffffffffffffffff166111a6611227565b73ffffffffffffffffffffffffffffffffffffffff16146111fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111f390613854565b60405180910390fd5b6000611208600a611acc565b9050611214600a611748565b61121e8382611eda565b80915050919050565b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600e60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6060600180546112b690613b95565b80601f01602080910402602001604051908101604052809291908181526020018280546112e290613b95565b801561132f5780601f106113045761010080835404028352916020019161132f565b820191906000526020600020905b81548152906001019060200180831161131257829003601f168201915b5050505050905090565b60005b81518110156113f0576001600e6000848481518110611384577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080806113e890613bc7565b91505061133c565b5050565b6114066113ff6118e5565b8383611ef8565b5050565b61141b6114156118e5565b83611ada565b61145a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611451906138d4565b60405180910390fd5b61146684848484612065565b50505050565b606061147661149c565b604051602001611486919061349d565b6040516020818303038152906040529050919050565b6060600c80546114ab90613b95565b80601f01602080910402602001604051908101604052809291908181526020018280546114d790613b95565b80156115245780601f106114f957610100808354040283529160200191611524565b820191906000526020600020905b81548152906001019060200180831161150757829003601f168201915b5050505050905090565b6060604051806060016040528060398152602001613dce60399139905090565b600080600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1663c4552791866040518263ffffffff1660e01b81526004016115c691906134eb565b60206040518083038186803b1580156115de57600080fd5b505afa1580156115f2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116169190612b48565b73ffffffffffffffffffffffffffffffffffffffff16141561163c57600191505061164a565b61164684846120c1565b9150505b92915050565b6116586118e5565b73ffffffffffffffffffffffffffffffffffffffff16611676611227565b73ffffffffffffffffffffffffffffffffffffffff16146116cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116c390613854565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561173c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611733906136b4565b60405180910390fd5b61174581611e14565b50565b6001816000016000828254019250508190555050565b60003073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561180857600080368080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509050600080369050905073ffffffffffffffffffffffffffffffffffffffff81830151169250505061180c565b3390505b90565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60006118ef61175e565b905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff1661196783610f8c565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161415611a1e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a1590613774565b60405180910390fd5b6001611a31611a2c87612155565b6121bd565b83868660405160008152602001604052604051611a51949392919061360b565b6020604051602081039080840390855afa158015611a73573d6000803e3d6000fd5b5050506020604051035173ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614905095945050505050565b60008183611ac49190613a1a565b905092915050565b600081600001549050919050565b6000611ae58261180f565b611b24576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b1b90613754565b60405180910390fd5b6000611b2f83610f8c565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480611b9e57508373ffffffffffffffffffffffffffffffffffffffff16611b8684610982565b73ffffffffffffffffffffffffffffffffffffffff16145b80611baf5750611bae818561154e565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16611bd882610f8c565b73ffffffffffffffffffffffffffffffffffffffff1614611c2e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c2590613874565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611c9e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c9590613714565b60405180910390fd5b611ca98383836121f6565b611cb46000826118f4565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611d049190613a70565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611d5b9190613a1a565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b611ef48282604051806020016040528060008152506121fb565b5050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611f67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611f5e90613734565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516120589190613590565b60405180910390a3505050565b612070848484611bb8565b61207c84848484612256565b6120bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016120b290613694565b60405180910390fd5b50505050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6000604051806080016040528060438152602001613d8b6043913980519060200120826000015183602001518460400151805190602001206040516020016121a094939291906135c6565b604051602081830303815290604052805190602001209050919050565b60006121c7610de7565b826040516020016121d99291906134b4565b604051602081830303815290604052805190602001209050919050565b505050565b61220583836123ed565b6122126000848484612256565b612251576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161224890613694565b60405180910390fd5b505050565b60006122778473ffffffffffffffffffffffffffffffffffffffff166125bb565b156123e0578373ffffffffffffffffffffffffffffffffffffffff1663150b7a026122a06118e5565b8786866040518563ffffffff1660e01b81526004016122c29493929190613544565b602060405180830381600087803b1580156122dc57600080fd5b505af192505050801561230d57506040513d601f19601f8201168201806040525081019061230a9190612b1f565b60015b612390573d806000811461233d576040519150601f19603f3d011682016040523d82523d6000602084013e612342565b606091505b50600081511415612388576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161237f90613694565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149150506123e5565b600190505b949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561245d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612454906137f4565b60405180910390fd5b6124668161180f565b156124a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161249d906136f4565b60405180910390fd5b6124b2600083836121f6565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546125029190613a1a565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b600080823b905060008111915050919050565b8280546125da90613b95565b90600052602060002090601f0160209004810192826125fc5760008555612643565b82601f1061261557805160ff1916838001178555612643565b82800160010185558215612643579182015b82811115612642578251825591602001919060010190612627565b5b5090506126509190612654565b5090565b5b8082111561266d576000816000905550600101612655565b5090565b600061268461267f84613940565b61390f565b905080838252602082019050828560208602820111156126a357600080fd5b60005b858110156126d357816126b98882612759565b8452602084019350602083019250506001810190506126a6565b5050509392505050565b60006126f06126eb8461396c565b61390f565b90508281526020810184848401111561270857600080fd5b612713848285613b53565b509392505050565b600061272e6127298461399c565b61390f565b90508281526020810184848401111561274657600080fd5b612751848285613b53565b509392505050565b60008135905061276881613ce9565b92915050565b600082601f83011261277f57600080fd5b813561278f848260208601612671565b91505092915050565b6000813590506127a781613d00565b92915050565b6000813590506127bc81613d17565b92915050565b6000813590506127d181613d2e565b92915050565b6000815190506127e681613d2e565b92915050565b600082601f8301126127fd57600080fd5b813561280d8482602086016126dd565b91505092915050565b60008151905061282581613d45565b92915050565b600082601f83011261283c57600080fd5b813561284c84826020860161271b565b91505092915050565b60008135905061286481613d5c565b92915050565b60008135905061287981613d73565b92915050565b60006020828403121561289157600080fd5b600061289f84828501612759565b91505092915050565b600080604083850312156128bb57600080fd5b60006128c985828601612759565b92505060206128da85828601612759565b9150509250929050565b6000806000606084860312156128f957600080fd5b600061290786828701612759565b935050602061291886828701612759565b925050604061292986828701612855565b9150509250925092565b6000806000806080858703121561294957600080fd5b600061295787828801612759565b945050602061296887828801612759565b935050604061297987828801612855565b925050606085013567ffffffffffffffff81111561299657600080fd5b6129a2878288016127ec565b91505092959194509250565b600080604083850312156129c157600080fd5b60006129cf85828601612759565b92505060206129e085828601612798565b9150509250929050565b600080600080600060a08688031215612a0257600080fd5b6000612a1088828901612759565b955050602086013567ffffffffffffffff811115612a2d57600080fd5b612a39888289016127ec565b9450506040612a4a888289016127ad565b9350506060612a5b888289016127ad565b9250506080612a6c8882890161286a565b9150509295509295909350565b60008060408385031215612a8c57600080fd5b6000612a9a85828601612759565b9250506020612aab85828601612855565b9150509250929050565b600060208284031215612ac757600080fd5b600082013567ffffffffffffffff811115612ae157600080fd5b612aed8482850161276e565b91505092915050565b600060208284031215612b0857600080fd5b6000612b16848285016127c2565b91505092915050565b600060208284031215612b3157600080fd5b6000612b3f848285016127d7565b91505092915050565b600060208284031215612b5a57600080fd5b6000612b6884828501612816565b91505092915050565b600060208284031215612b8357600080fd5b6000612b9184828501612855565b91505092915050565b60008060408385031215612bad57600080fd5b6000612bbb85828601612855565b925050602083013567ffffffffffffffff811115612bd857600080fd5b612be48582860161282b565b9150509250929050565b612bf781613ab6565b82525050565b612c0681613aa4565b82525050565b612c1d612c1882613aa4565b613c10565b82525050565b612c2c81613ac8565b82525050565b612c3b81613ad4565b82525050565b612c52612c4d82613ad4565b613c22565b82525050565b6000612c63826139cc565b612c6d81856139e2565b9350612c7d818560208601613b62565b612c8681613ccb565b840191505092915050565b6000612c9c826139cc565b612ca681856139f3565b9350612cb6818560208601613b62565b80840191505092915050565b6000612ccd826139d7565b612cd781856139fe565b9350612ce7818560208601613b62565b612cf081613ccb565b840191505092915050565b6000612d06826139d7565b612d108185613a0f565b9350612d20818560208601613b62565b80840191505092915050565b6000612d396032836139fe565b91507f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008301527f63656976657220696d706c656d656e74657200000000000000000000000000006020830152604082019050919050565b6000612d9f6026836139fe565b91507f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008301527f64647265737300000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612e05601c836139fe565b91507f46756e6374696f6e2063616c6c206e6f74207375636365737366756c000000006000830152602082019050919050565b6000612e45601c836139fe565b91507f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006000830152602082019050919050565b6000612e85600283613a0f565b91507f19010000000000000000000000000000000000000000000000000000000000006000830152600282019050919050565b6000612ec56024836139fe565b91507f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612f2b6019836139fe565b91507f4552433732313a20617070726f766520746f2063616c6c6572000000000000006000830152602082019050919050565b6000612f6b602c836139fe565b91507f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008301527f697374656e7420746f6b656e00000000000000000000000000000000000000006020830152604082019050919050565b6000612fd16025836139fe565b91507f4e61746976654d6574615472616e73616374696f6e3a20494e56414c49445f5360008301527f49474e45520000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006130376038836139fe565b91507f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008301527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006020830152604082019050919050565b600061309d602a836139fe565b91507f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008301527f726f2061646472657373000000000000000000000000000000000000000000006020830152604082019050919050565b60006131036029836139fe565b91507f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008301527f656e7420746f6b656e00000000000000000000000000000000000000000000006020830152604082019050919050565b60006131696020836139fe565b91507f4552433732313a206d696e7420746f20746865207a65726f20616464726573736000830152602082019050919050565b60006131a9602c836139fe565b91507f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008301527f697374656e7420746f6b656e00000000000000000000000000000000000000006020830152604082019050919050565b600061320f602c836139fe565b91507f4552433732314d657461646174613a2055524920736574206f66206e6f6e657860008301527f697374656e7420746f6b656e00000000000000000000000000000000000000006020830152604082019050919050565b60006132756020836139fe565b91507f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726000830152602082019050919050565b60006132b56029836139fe565b91507f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960008301527f73206e6f74206f776e00000000000000000000000000000000000000000000006020830152604082019050919050565b600061331b6021836139fe565b91507f5369676e657220616e64207369676e617475726520646f206e6f74206d61746360008301527f68000000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006133816021836139fe565b91507f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008301527f72000000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006133e76031836139fe565b91507f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008301527f776e6572206e6f7220617070726f7665640000000000000000000000000000006020830152604082019050919050565b61344981613b3c565b82525050565b61345881613b46565b82525050565b600061346a8284612c91565b915081905092915050565b60006134818285612c91565b915061348d8284612c0c565b6014820191508190509392505050565b60006134a98284612cfb565b915081905092915050565b60006134bf82612e78565b91506134cb8285612c41565b6020820191506134db8284612c41565b6020820191508190509392505050565b60006020820190506135006000830184612bfd565b92915050565b600060608201905061351b6000830186612bfd565b6135286020830185612bee565b818103604083015261353a8184612c58565b9050949350505050565b60006080820190506135596000830187612bfd565b6135666020830186612bfd565b6135736040830185613440565b81810360608301526135858184612c58565b905095945050505050565b60006020820190506135a56000830184612c23565b92915050565b60006020820190506135c06000830184612c32565b92915050565b60006080820190506135db6000830187612c32565b6135e86020830186613440565b6135f56040830185612bfd565b6136026060830184612c32565b95945050505050565b60006080820190506136206000830187612c32565b61362d602083018661344f565b61363a6040830185612c32565b6136476060830184612c32565b95945050505050565b6000602082019050818103600083015261366a8184612c58565b905092915050565b6000602082019050818103600083015261368c8184612cc2565b905092915050565b600060208201905081810360008301526136ad81612d2c565b9050919050565b600060208201905081810360008301526136cd81612d92565b9050919050565b600060208201905081810360008301526136ed81612df8565b9050919050565b6000602082019050818103600083015261370d81612e38565b9050919050565b6000602082019050818103600083015261372d81612eb8565b9050919050565b6000602082019050818103600083015261374d81612f1e565b9050919050565b6000602082019050818103600083015261376d81612f5e565b9050919050565b6000602082019050818103600083015261378d81612fc4565b9050919050565b600060208201905081810360008301526137ad8161302a565b9050919050565b600060208201905081810360008301526137cd81613090565b9050919050565b600060208201905081810360008301526137ed816130f6565b9050919050565b6000602082019050818103600083015261380d8161315c565b9050919050565b6000602082019050818103600083015261382d8161319c565b9050919050565b6000602082019050818103600083015261384d81613202565b9050919050565b6000602082019050818103600083015261386d81613268565b9050919050565b6000602082019050818103600083015261388d816132a8565b9050919050565b600060208201905081810360008301526138ad8161330e565b9050919050565b600060208201905081810360008301526138cd81613374565b9050919050565b600060208201905081810360008301526138ed816133da565b9050919050565b60006020820190506139096000830184613440565b92915050565b6000604051905081810181811067ffffffffffffffff8211171561393657613935613c9c565b5b8060405250919050565b600067ffffffffffffffff82111561395b5761395a613c9c565b5b602082029050602081019050919050565b600067ffffffffffffffff82111561398757613986613c9c565b5b601f19601f8301169050602081019050919050565b600067ffffffffffffffff8211156139b7576139b6613c9c565b5b601f19601f8301169050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000613a2582613b3c565b9150613a3083613b3c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115613a6557613a64613c3e565b5b828201905092915050565b6000613a7b82613b3c565b9150613a8683613b3c565b925082821015613a9957613a98613c3e565b5b828203905092915050565b6000613aaf82613b1c565b9050919050565b6000613ac182613b1c565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6000613b1582613aa4565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b83811015613b80578082015181840152602081019050613b65565b83811115613b8f576000848401525b50505050565b60006002820490506001821680613bad57607f821691505b60208210811415613bc157613bc0613c6d565b5b50919050565b6000613bd282613b3c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415613c0557613c04613c3e565b5b600182019050919050565b6000613c1b82613c2c565b9050919050565b6000819050919050565b6000613c3782613cdc565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b60008160601b9050919050565b613cf281613aa4565b8114613cfd57600080fd5b50565b613d0981613ac8565b8114613d1457600080fd5b50565b613d2081613ad4565b8114613d2b57600080fd5b50565b613d3781613ade565b8114613d4257600080fd5b50565b613d4e81613b0a565b8114613d5957600080fd5b50565b613d6581613b3c565b8114613d7057600080fd5b50565b613d7c81613b46565b8114613d8757600080fd5b5056fe4d6574615472616e73616374696f6e2875696e74323536206e6f6e63652c616464726573732066726f6d2c62797465732066756e6374696f6e5369676e61747572652968747470733a2f2f6d6f6e616c697a612d6170692e6f70656e7365612e696f2f636f6e74726163742f6f70656e7365612d6d6f6e616c697a61a264697066735822122033bf2445ac526957918b6d3853657d556f59e8f4d5bc1c1485b3de56aae0b88a64736f6c63430008000033454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c6164647265737320766572696679696e67436f6e74726163742c627974657333322073616c7429",
    "deployedBytecode": "0x6080604052600436106101cd5760003560e01c80636352211e116100f75780639deecd3811610095578063d547cfb711610064578063d547cfb7146106c7578063e8a3d485146106f2578063e985e9c51461071d578063f2fde38b1461075a576101cd565b80639deecd381461060f578063a22cb46514610638578063b88d4fde14610661578063c87b56dd1461068a576101cd565b8063755edd17116100d1578063755edd171461053f5780638da5cb5b1461057c5780638fa2a903146105a757806395d89b41146105e4576101cd565b80636352211e146104ae57806370a08231146104eb578063715018a614610528576101cd565b806318160ddd1161016f5780633408e4701161013e5780633408e470146103e05780633bb3a24d1461040b5780634120657a1461044857806342842e0e14610485576101cd565b806318160ddd1461032457806320379ee51461034f57806323b872dd1461037a5780632d0335ab146103a3576101cd565b8063081812fc116101ab578063081812fc14610263578063095ea7b3146102a05780630c53c51c146102c95780630f7e5970146102f9576101cd565b806301538868146101d257806301ffc9a7146101fb57806306fdde0314610238575b600080fd5b3480156101de57600080fd5b506101f960048036038101906101f49190612b9a565b610783565b005b34801561020757600080fd5b50610222600480360381019061021d9190612af6565b61080e565b60405161022f9190613590565b60405180910390f35b34801561024457600080fd5b5061024d6108f0565b60405161025a9190613672565b60405180910390f35b34801561026f57600080fd5b5061028a60048036038101906102859190612b71565b610982565b60405161029791906134eb565b60405180910390f35b3480156102ac57600080fd5b506102c760048036038101906102c29190612a79565b610a07565b005b6102e360048036038101906102de91906129ea565b610b1f565b6040516102f09190613650565b60405180910390f35b34801561030557600080fd5b5061030e610d91565b60405161031b9190613672565b60405180910390f35b34801561033057600080fd5b50610339610dca565b60405161034691906138f4565b60405180910390f35b34801561035b57600080fd5b50610364610de7565b60405161037191906135ab565b60405180910390f35b34801561038657600080fd5b506103a1600480360381019061039c91906128e4565b610df1565b005b3480156103af57600080fd5b506103ca60048036038101906103c5919061287f565b610e51565b6040516103d791906138f4565b60405180910390f35b3480156103ec57600080fd5b506103f5610e9a565b60405161040291906138f4565b60405180910390f35b34801561041757600080fd5b50610432600480360381019061042d9190612b71565b610ea7565b60405161043f9190613672565b60405180910390f35b34801561045457600080fd5b5061046f600480360381019061046a919061287f565b610f4c565b60405161047c9190613590565b60405180910390f35b34801561049157600080fd5b506104ac60048036038101906104a791906128e4565b610f6c565b005b3480156104ba57600080fd5b506104d560048036038101906104d09190612b71565b610f8c565b6040516104e291906134eb565b60405180910390f35b3480156104f757600080fd5b50610512600480360381019061050d919061287f565b61103e565b60405161051f91906138f4565b60405180910390f35b34801561053457600080fd5b5061053d6110f6565b005b34801561054b57600080fd5b506105666004803603810190610561919061287f565b61117e565b60405161057391906138f4565b60405180910390f35b34801561058857600080fd5b50610591611227565b60405161059e91906134eb565b60405180910390f35b3480156105b357600080fd5b506105ce60048036038101906105c9919061287f565b611251565b6040516105db9190613590565b60405180910390f35b3480156105f057600080fd5b506105f96112a7565b6040516106069190613672565b60405180910390f35b34801561061b57600080fd5b5061063660048036038101906106319190612ab5565b611339565b005b34801561064457600080fd5b5061065f600480360381019061065a91906129ae565b6113f4565b005b34801561066d57600080fd5b5061068860048036038101906106839190612933565b61140a565b005b34801561069657600080fd5b506106b160048036038101906106ac9190612b71565b61146c565b6040516106be9190613672565b60405180910390f35b3480156106d357600080fd5b506106dc61149c565b6040516106e99190613672565b60405180910390f35b3480156106fe57600080fd5b5061070761152e565b6040516107149190613672565b60405180910390f35b34801561072957600080fd5b50610744600480360381019061073f91906128a8565b61154e565b6040516107519190613590565b60405180910390f35b34801561076657600080fd5b50610781600480360381019061077c919061287f565b611650565b005b61078c8261180f565b6107cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107c290613834565b60405180910390fd5b80600d600084815260200190815260200160002090805190602001906107f29291906125ce565b5080600c90805190602001906108099291906125ce565b505050565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806108d957507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806108e957506108e88261187b565b5b9050919050565b6060600080546108ff90613b95565b80601f016020809104026020016040519081016040528092919081815260200182805461092b90613b95565b80156109785780601f1061094d57610100808354040283529160200191610978565b820191906000526020600020905b81548152906001019060200180831161095b57829003601f168201915b5050505050905090565b600061098d8261180f565b6109cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c390613814565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000610a1282610f8c565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610a83576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a7a906138b4565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610aa26118e5565b73ffffffffffffffffffffffffffffffffffffffff161480610ad15750610ad081610acb6118e5565b61154e565b5b610b10576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0790613794565b60405180910390fd5b610b1a83836118f4565b505050565b606060006040518060600160405280600860008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205481526020018873ffffffffffffffffffffffffffffffffffffffff168152602001878152509050610ba287828787876119ad565b610be1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bd890613894565b60405180910390fd5b610c346001600860008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611ab690919063ffffffff16565b600860008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f5845892132946850460bff5a0083f71031bc5bf9aadcd40f1de79423eac9b10b873388604051610caa93929190613506565b60405180910390a16000803073ffffffffffffffffffffffffffffffffffffffff16888a604051602001610cdf929190613475565b604051602081830303815290604052604051610cfb919061345e565b6000604051808303816000865af19150503d8060008114610d38576040519150601f19603f3d011682016040523d82523d6000602084013e610d3d565b606091505b509150915081610d82576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d79906136d4565b60405180910390fd5b80935050505095945050505050565b6040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525081565b60006001610dd8600a611acc565b610de29190613a70565b905090565b6000600754905090565b610e02610dfc6118e5565b82611ada565b610e41576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e38906138d4565b60405180910390fd5b610e4c838383611bb8565b505050565b6000600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000804690508091505090565b6060600d60008381526020019081526020016000208054610ec790613b95565b80601f0160208091040260200160405190810160405280929190818152602001828054610ef390613b95565b8015610f405780601f10610f1557610100808354040283529160200191610f40565b820191906000526020600020905b815481529060010190602001808311610f2357829003601f168201915b50505050509050919050565b600e6020528060005260406000206000915054906101000a900460ff1681565b610f878383836040518060200160405280600081525061140a565b505050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611035576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161102c906137d4565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156110af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110a6906137b4565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6110fe6118e5565b73ffffffffffffffffffffffffffffffffffffffff1661111c611227565b73ffffffffffffffffffffffffffffffffffffffff1614611172576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161116990613854565b60405180910390fd5b61117c6000611e14565b565b60006111886118e5565b73ffffffffffffffffffffffffffffffffffffffff166111a6611227565b73ffffffffffffffffffffffffffffffffffffffff16146111fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111f390613854565b60405180910390fd5b6000611208600a611acc565b9050611214600a611748565b61121e8382611eda565b80915050919050565b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600e60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6060600180546112b690613b95565b80601f01602080910402602001604051908101604052809291908181526020018280546112e290613b95565b801561132f5780601f106113045761010080835404028352916020019161132f565b820191906000526020600020905b81548152906001019060200180831161131257829003601f168201915b5050505050905090565b60005b81518110156113f0576001600e6000848481518110611384577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080806113e890613bc7565b91505061133c565b5050565b6114066113ff6118e5565b8383611ef8565b5050565b61141b6114156118e5565b83611ada565b61145a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611451906138d4565b60405180910390fd5b61146684848484612065565b50505050565b606061147661149c565b604051602001611486919061349d565b6040516020818303038152906040529050919050565b6060600c80546114ab90613b95565b80601f01602080910402602001604051908101604052809291908181526020018280546114d790613b95565b80156115245780601f106114f957610100808354040283529160200191611524565b820191906000526020600020905b81548152906001019060200180831161150757829003601f168201915b5050505050905090565b6060604051806060016040528060398152602001613dce60399139905090565b600080600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1663c4552791866040518263ffffffff1660e01b81526004016115c691906134eb565b60206040518083038186803b1580156115de57600080fd5b505afa1580156115f2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116169190612b48565b73ffffffffffffffffffffffffffffffffffffffff16141561163c57600191505061164a565b61164684846120c1565b9150505b92915050565b6116586118e5565b73ffffffffffffffffffffffffffffffffffffffff16611676611227565b73ffffffffffffffffffffffffffffffffffffffff16146116cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116c390613854565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561173c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611733906136b4565b60405180910390fd5b61174581611e14565b50565b6001816000016000828254019250508190555050565b60003073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561180857600080368080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509050600080369050905073ffffffffffffffffffffffffffffffffffffffff81830151169250505061180c565b3390505b90565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60006118ef61175e565b905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff1661196783610f8c565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161415611a1e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a1590613774565b60405180910390fd5b6001611a31611a2c87612155565b6121bd565b83868660405160008152602001604052604051611a51949392919061360b565b6020604051602081039080840390855afa158015611a73573d6000803e3d6000fd5b5050506020604051035173ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614905095945050505050565b60008183611ac49190613a1a565b905092915050565b600081600001549050919050565b6000611ae58261180f565b611b24576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b1b90613754565b60405180910390fd5b6000611b2f83610f8c565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480611b9e57508373ffffffffffffffffffffffffffffffffffffffff16611b8684610982565b73ffffffffffffffffffffffffffffffffffffffff16145b80611baf5750611bae818561154e565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16611bd882610f8c565b73ffffffffffffffffffffffffffffffffffffffff1614611c2e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c2590613874565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611c9e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c9590613714565b60405180910390fd5b611ca98383836121f6565b611cb46000826118f4565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611d049190613a70565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611d5b9190613a1a565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b611ef48282604051806020016040528060008152506121fb565b5050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611f67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611f5e90613734565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516120589190613590565b60405180910390a3505050565b612070848484611bb8565b61207c84848484612256565b6120bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016120b290613694565b60405180910390fd5b50505050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6000604051806080016040528060438152602001613d8b6043913980519060200120826000015183602001518460400151805190602001206040516020016121a094939291906135c6565b604051602081830303815290604052805190602001209050919050565b60006121c7610de7565b826040516020016121d99291906134b4565b604051602081830303815290604052805190602001209050919050565b505050565b61220583836123ed565b6122126000848484612256565b612251576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161224890613694565b60405180910390fd5b505050565b60006122778473ffffffffffffffffffffffffffffffffffffffff166125bb565b156123e0578373ffffffffffffffffffffffffffffffffffffffff1663150b7a026122a06118e5565b8786866040518563ffffffff1660e01b81526004016122c29493929190613544565b602060405180830381600087803b1580156122dc57600080fd5b505af192505050801561230d57506040513d601f19601f8201168201806040525081019061230a9190612b1f565b60015b612390573d806000811461233d576040519150601f19603f3d011682016040523d82523d6000602084013e612342565b606091505b50600081511415612388576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161237f90613694565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149150506123e5565b600190505b949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561245d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612454906137f4565b60405180910390fd5b6124668161180f565b156124a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161249d906136f4565b60405180910390fd5b6124b2600083836121f6565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546125029190613a1a565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b600080823b905060008111915050919050565b8280546125da90613b95565b90600052602060002090601f0160209004810192826125fc5760008555612643565b82601f1061261557805160ff1916838001178555612643565b82800160010185558215612643579182015b82811115612642578251825591602001919060010190612627565b5b5090506126509190612654565b5090565b5b8082111561266d576000816000905550600101612655565b5090565b600061268461267f84613940565b61390f565b905080838252602082019050828560208602820111156126a357600080fd5b60005b858110156126d357816126b98882612759565b8452602084019350602083019250506001810190506126a6565b5050509392505050565b60006126f06126eb8461396c565b61390f565b90508281526020810184848401111561270857600080fd5b612713848285613b53565b509392505050565b600061272e6127298461399c565b61390f565b90508281526020810184848401111561274657600080fd5b612751848285613b53565b509392505050565b60008135905061276881613ce9565b92915050565b600082601f83011261277f57600080fd5b813561278f848260208601612671565b91505092915050565b6000813590506127a781613d00565b92915050565b6000813590506127bc81613d17565b92915050565b6000813590506127d181613d2e565b92915050565b6000815190506127e681613d2e565b92915050565b600082601f8301126127fd57600080fd5b813561280d8482602086016126dd565b91505092915050565b60008151905061282581613d45565b92915050565b600082601f83011261283c57600080fd5b813561284c84826020860161271b565b91505092915050565b60008135905061286481613d5c565b92915050565b60008135905061287981613d73565b92915050565b60006020828403121561289157600080fd5b600061289f84828501612759565b91505092915050565b600080604083850312156128bb57600080fd5b60006128c985828601612759565b92505060206128da85828601612759565b9150509250929050565b6000806000606084860312156128f957600080fd5b600061290786828701612759565b935050602061291886828701612759565b925050604061292986828701612855565b9150509250925092565b6000806000806080858703121561294957600080fd5b600061295787828801612759565b945050602061296887828801612759565b935050604061297987828801612855565b925050606085013567ffffffffffffffff81111561299657600080fd5b6129a2878288016127ec565b91505092959194509250565b600080604083850312156129c157600080fd5b60006129cf85828601612759565b92505060206129e085828601612798565b9150509250929050565b600080600080600060a08688031215612a0257600080fd5b6000612a1088828901612759565b955050602086013567ffffffffffffffff811115612a2d57600080fd5b612a39888289016127ec565b9450506040612a4a888289016127ad565b9350506060612a5b888289016127ad565b9250506080612a6c8882890161286a565b9150509295509295909350565b60008060408385031215612a8c57600080fd5b6000612a9a85828601612759565b9250506020612aab85828601612855565b9150509250929050565b600060208284031215612ac757600080fd5b600082013567ffffffffffffffff811115612ae157600080fd5b612aed8482850161276e565b91505092915050565b600060208284031215612b0857600080fd5b6000612b16848285016127c2565b91505092915050565b600060208284031215612b3157600080fd5b6000612b3f848285016127d7565b91505092915050565b600060208284031215612b5a57600080fd5b6000612b6884828501612816565b91505092915050565b600060208284031215612b8357600080fd5b6000612b9184828501612855565b91505092915050565b60008060408385031215612bad57600080fd5b6000612bbb85828601612855565b925050602083013567ffffffffffffffff811115612bd857600080fd5b612be48582860161282b565b9150509250929050565b612bf781613ab6565b82525050565b612c0681613aa4565b82525050565b612c1d612c1882613aa4565b613c10565b82525050565b612c2c81613ac8565b82525050565b612c3b81613ad4565b82525050565b612c52612c4d82613ad4565b613c22565b82525050565b6000612c63826139cc565b612c6d81856139e2565b9350612c7d818560208601613b62565b612c8681613ccb565b840191505092915050565b6000612c9c826139cc565b612ca681856139f3565b9350612cb6818560208601613b62565b80840191505092915050565b6000612ccd826139d7565b612cd781856139fe565b9350612ce7818560208601613b62565b612cf081613ccb565b840191505092915050565b6000612d06826139d7565b612d108185613a0f565b9350612d20818560208601613b62565b80840191505092915050565b6000612d396032836139fe565b91507f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008301527f63656976657220696d706c656d656e74657200000000000000000000000000006020830152604082019050919050565b6000612d9f6026836139fe565b91507f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008301527f64647265737300000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612e05601c836139fe565b91507f46756e6374696f6e2063616c6c206e6f74207375636365737366756c000000006000830152602082019050919050565b6000612e45601c836139fe565b91507f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006000830152602082019050919050565b6000612e85600283613a0f565b91507f19010000000000000000000000000000000000000000000000000000000000006000830152600282019050919050565b6000612ec56024836139fe565b91507f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612f2b6019836139fe565b91507f4552433732313a20617070726f766520746f2063616c6c6572000000000000006000830152602082019050919050565b6000612f6b602c836139fe565b91507f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008301527f697374656e7420746f6b656e00000000000000000000000000000000000000006020830152604082019050919050565b6000612fd16025836139fe565b91507f4e61746976654d6574615472616e73616374696f6e3a20494e56414c49445f5360008301527f49474e45520000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006130376038836139fe565b91507f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008301527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006020830152604082019050919050565b600061309d602a836139fe565b91507f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008301527f726f2061646472657373000000000000000000000000000000000000000000006020830152604082019050919050565b60006131036029836139fe565b91507f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008301527f656e7420746f6b656e00000000000000000000000000000000000000000000006020830152604082019050919050565b60006131696020836139fe565b91507f4552433732313a206d696e7420746f20746865207a65726f20616464726573736000830152602082019050919050565b60006131a9602c836139fe565b91507f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008301527f697374656e7420746f6b656e00000000000000000000000000000000000000006020830152604082019050919050565b600061320f602c836139fe565b91507f4552433732314d657461646174613a2055524920736574206f66206e6f6e657860008301527f697374656e7420746f6b656e00000000000000000000000000000000000000006020830152604082019050919050565b60006132756020836139fe565b91507f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726000830152602082019050919050565b60006132b56029836139fe565b91507f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960008301527f73206e6f74206f776e00000000000000000000000000000000000000000000006020830152604082019050919050565b600061331b6021836139fe565b91507f5369676e657220616e64207369676e617475726520646f206e6f74206d61746360008301527f68000000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006133816021836139fe565b91507f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008301527f72000000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006133e76031836139fe565b91507f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008301527f776e6572206e6f7220617070726f7665640000000000000000000000000000006020830152604082019050919050565b61344981613b3c565b82525050565b61345881613b46565b82525050565b600061346a8284612c91565b915081905092915050565b60006134818285612c91565b915061348d8284612c0c565b6014820191508190509392505050565b60006134a98284612cfb565b915081905092915050565b60006134bf82612e78565b91506134cb8285612c41565b6020820191506134db8284612c41565b6020820191508190509392505050565b60006020820190506135006000830184612bfd565b92915050565b600060608201905061351b6000830186612bfd565b6135286020830185612bee565b818103604083015261353a8184612c58565b9050949350505050565b60006080820190506135596000830187612bfd565b6135666020830186612bfd565b6135736040830185613440565b81810360608301526135858184612c58565b905095945050505050565b60006020820190506135a56000830184612c23565b92915050565b60006020820190506135c06000830184612c32565b92915050565b60006080820190506135db6000830187612c32565b6135e86020830186613440565b6135f56040830185612bfd565b6136026060830184612c32565b95945050505050565b60006080820190506136206000830187612c32565b61362d602083018661344f565b61363a6040830185612c32565b6136476060830184612c32565b95945050505050565b6000602082019050818103600083015261366a8184612c58565b905092915050565b6000602082019050818103600083015261368c8184612cc2565b905092915050565b600060208201905081810360008301526136ad81612d2c565b9050919050565b600060208201905081810360008301526136cd81612d92565b9050919050565b600060208201905081810360008301526136ed81612df8565b9050919050565b6000602082019050818103600083015261370d81612e38565b9050919050565b6000602082019050818103600083015261372d81612eb8565b9050919050565b6000602082019050818103600083015261374d81612f1e565b9050919050565b6000602082019050818103600083015261376d81612f5e565b9050919050565b6000602082019050818103600083015261378d81612fc4565b9050919050565b600060208201905081810360008301526137ad8161302a565b9050919050565b600060208201905081810360008301526137cd81613090565b9050919050565b600060208201905081810360008301526137ed816130f6565b9050919050565b6000602082019050818103600083015261380d8161315c565b9050919050565b6000602082019050818103600083015261382d8161319c565b9050919050565b6000602082019050818103600083015261384d81613202565b9050919050565b6000602082019050818103600083015261386d81613268565b9050919050565b6000602082019050818103600083015261388d816132a8565b9050919050565b600060208201905081810360008301526138ad8161330e565b9050919050565b600060208201905081810360008301526138cd81613374565b9050919050565b600060208201905081810360008301526138ed816133da565b9050919050565b60006020820190506139096000830184613440565b92915050565b6000604051905081810181811067ffffffffffffffff8211171561393657613935613c9c565b5b8060405250919050565b600067ffffffffffffffff82111561395b5761395a613c9c565b5b602082029050602081019050919050565b600067ffffffffffffffff82111561398757613986613c9c565b5b601f19601f8301169050602081019050919050565b600067ffffffffffffffff8211156139b7576139b6613c9c565b5b601f19601f8301169050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000613a2582613b3c565b9150613a3083613b3c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115613a6557613a64613c3e565b5b828201905092915050565b6000613a7b82613b3c565b9150613a8683613b3c565b925082821015613a9957613a98613c3e565b5b828203905092915050565b6000613aaf82613b1c565b9050919050565b6000613ac182613b1c565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6000613b1582613aa4565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b83811015613b80578082015181840152602081019050613b65565b83811115613b8f576000848401525b50505050565b60006002820490506001821680613bad57607f821691505b60208210811415613bc157613bc0613c6d565b5b50919050565b6000613bd282613b3c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415613c0557613c04613c3e565b5b600182019050919050565b6000613c1b82613c2c565b9050919050565b6000819050919050565b6000613c3782613cdc565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b60008160601b9050919050565b613cf281613aa4565b8114613cfd57600080fd5b50565b613d0981613ac8565b8114613d1457600080fd5b50565b613d2081613ad4565b8114613d2b57600080fd5b50565b613d3781613ade565b8114613d4257600080fd5b50565b613d4e81613b0a565b8114613d5957600080fd5b50565b613d6581613b3c565b8114613d7057600080fd5b50565b613d7c81613b46565b8114613d8757600080fd5b5056fe4d6574615472616e73616374696f6e2875696e74323536206e6f6e63652c616464726573732066726f6d2c62797465732066756e6374696f6e5369676e61747572652968747470733a2f2f6d6f6e616c697a612d6170692e6f70656e7365612e696f2f636f6e74726163742f6f70656e7365612d6d6f6e616c697a61a264697066735822122033bf2445ac526957918b6d3853657d556f59e8f4d5bc1c1485b3de56aae0b88a64736f6c63430008000033",
    "linkReferences": {},
    "deployedLinkReferences": {}
  }
  