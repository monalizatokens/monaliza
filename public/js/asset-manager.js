//We can call contract function from browser as well, see link below
//https://ethereum.stackexchange.com/questions/25431/metamask-how-to-access-call-deployed-contracts-functions-using-metamask


$( document ).ready(function() {
    var accountHere= ""
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
                    fileName: localStorage.getItem("fileName"),
                    contractAddress : "0x6aaeABe1c4762264216b194978E77b730501B1E9",
                    assetName: $("#assetName").val(),
                    //assetSymbol: $("#assetSymbol").val(),
                    assetSymbol: "MNLZ",
                    docURL: $("#docURL").val(),
                    description: $("#description").val(),
                    addresses: addressses,
                    sign: sign
                }
                var url = "/deploynftcontract"
                
                $("#myProgress").show();
                startProgressBar();
    
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
                            duration: 300000,
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
                            duration: 300000,
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


    async function getAccount() {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        accountHere = account;
        console.log(account);
    }

});