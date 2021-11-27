//We can call contract function from browser as well, see link below
//https://ethereum.stackexchange.com/questions/25431/metamask-how-to-access-call-deployed-contracts-functions-using-metamask


$( document ).ready(function() {
    var accountHere= ""

    $.showNotification({
        body:"<h3>" + "Please connect your wallet." + "</h3>",
        duration: 1200,
        maxWidth:"820px",
        shadow:"0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 100,
        margin:"5rem"
    });

    localStorage.setItem('fileName', ''); 
    
    console.log( "ready!" );
    $("#myProgress").hide();

    $("#fileuploaderform").submit(function(e){
        //$("#fileuploaderform").submit();
        //event.preventDefault()
        console.log("In fileupload handler")
        $.ajax( {
            url: '/fileupload',
            type: 'POST',
            data: new FormData( this ),
            processData: false,
            contentType: false,
            success: function(result){
                console.log(result);
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
                const web3Instance = new Web3(window['ethereum']);
                msgHash = web3Instance.utils.sha3(web3Instance.utils.toHex("test1"), {encoding: "hex"})
                //if (!accountHere) return connect()
                var sign = "";
                web3Instance.eth.personal.sign(msgHash, accountHere, function (err, result) {
                    if (err) return console.error(err)
                    console.log('SIGNED:' + result)
                    sign = result;
                  })
    
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
                    sign: sign
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
        if($(".connect-wallet-btn").html() == "Connect Wallet"){
            validationStatus = false;
            $.showNotification({
                  body:"<h3>Connect Metamask wallet.</h3>"
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

    $(".connect-wallet-btn").click(function(){
        console.log("create-asset-connect-wallet-btn clicked");
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            getAccount();
            $(this).html("Connected");
            
        }else{
            alert("Please install Metamask.");
        }
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
                    body:"<h3>" + "Please make sure there are no empty airdrop addresses." + "</h3>",
                    duration: 1200,
                    maxWidth:"820px",
                    shadow:"0 2px 6px rgba(0,0,0,0.2)",
                    zIndex: 100,
                    margin:"5rem"
                });
                return;
            }else{
                console.log("came in else");
                var airDropAddresses = [];
                $('#addressTable >tbody >tr').each(function() {
                    var address = $(this).find("td:eq(0)  input[type='text']").val();
                    airDropAddresses.push(address);    
                })
                //Get file name of asset image on disk
                //Get NFT contract address of asset
                //Make Ajax call to mintnft() post method
                var data = {
                    "creatorAddress": accountHere,
                    "assetContractAddress": $("#assetList > option")[0].id,
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
        var rowCount = $('#addressTable >tbody >tr').length;
        $('#addressTable >tbody >tr').each(function() {
            var address = $(this).find("td:eq(0)  input[type='text']").val();
            console.log(address);
            if(address == '') emptyAddressRows = true;
        })
        console.log(emptyAddressRows);
        return emptyAddressRows;
    }

    $(".col-sm-12").on("click", ".claim-airdrop-btn", function(){
        console.log("claim-airdrop-btn clicked");
        console.log($( this ).hasClass("disabled"));
        if(! ($( this ).hasClass("disabled"))){
            console.log($( this ).attr("assetcontractaddress"));
            if($(".connect-wallet-btn").html() == "Connect Wallet"){
                validationStatus = false;
                $.showNotification({
                    body:"<h3>Connect Metamask wallet.</h3>"
                })
                return;
            }else{
                console.log("came in else");
                $(this).prop('disabled', true);
                var claimData = {
                    "userAddress": accountHere,
                    "assetContractAddress":$( this ).attr("assetcontractaddress"),
                    "ipfsURL": $( this ).attr("ipfsurl")
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
                        if(result){
                            $("#myProgress").hide();
                            $.showNotification({
                                duration: 12000,
                                body:"<h3>Airdrop claimed successfully. Add asset to Metamask with contract address " + claimData.assetContractAddress  + "</h3>"
                        })
                        }else {
                            $.showNotification({
                                body:"<h3>Airdrop couldn't be claimed. Please try again.</h3>"
                            })
                        }
                    }
                } );
            }
        }
    })



    async function getAccount() {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        accountHere = account;
        console.log(account);
        getAssets(account);
        loadClaimableAirdrops(account);
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
                for(var counter=0; counter < airdroppedAssetsGroupofThree.length; counter++){
                    /*$($(".col-sm-8")[0]).append(addCardDeck());
                    console.log(airdroppedAssetsGroupofThree[counter].length);
                    for(var innerCounter=0; innerCounter < airdroppedAssetsGroupofThree[counter].length; innerCounter++){
                        console.log("In inner for loop");
                        $($(".card-deck")[batchThreeCounter]).append(addCard());
                    } */ 
                    $($(".col-sm-12")[0]).append(addCardDeck());
                    for(var innerCounterTwo=0; innerCounterTwo < airdroppedAssetsGroupofThree[counter].length; innerCounterTwo++){
                        console.log("In inner for loop");
                        console.log(airdroppedAssetsGroupofThree[counter][innerCounterTwo]);
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
      var buttonText = "Already claimed"
      if(! assetDetails.claimed){
        buttonState = "";
        buttonText = "Claim"
      }

     var card = 
        '<div class="card">' +
            '<img class="card-img-top"  src="' + "/uploads/" + assetDetails.fileName + '" alt="Card image cap">' +
            '<div class="card-body">' +
            '<h5 class="card-title">'  +  assetDetails.assetName + '</h5>' +
            '<p class="card-text">'  + assetDescription  +  '</p>' +
            '</div>' +
            '<div class="card-footer">' +
            '<small class="text-muted">' + "Airdropped on " + date  + '</small>' +
            //'<div class="container">' +
                '<div class="text-center mt-3">' +
                    '<button  ' + ' assetContractAddress=' +  '"' + assetDetails.assetContractAddress + '"'  + ' userAddress=' + '"' + userAccount  + '"'  + ' ipfsURL=' + '"' + assetDetails.ipfsURL  + '"'  + ' type="submit" class="btn btn-primary btn-lg mt-3 claim-airdrop-btn ' +  buttonState +  '">' +  buttonText + '</button>' +  
                '</div>' +   
              //  '</div>' +
            '</div>' +
        '</div>'
    return card;
 }