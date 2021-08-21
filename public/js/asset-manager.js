$( document ).ready(function() {
    
    console.log( "ready!" );

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
                localStorage.setItem('fileName', result.file.filename); 
                //alert("File Uploaded successfully");    
                $.showNotification({
                      body:"<h3>File Uploaded successfully</h3>"
                })
                    
                $("#fileuploadbutton").prop("value", "Re-upload");
            }
          } );
          e.preventDefault();
    })
    
    $("#create-asset-btn").click(function()
        {
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
                assetSymbol: $("#assetSymbol").val(),
                docURL: $("#docURL").val(),
                description: $("#description").val(),
                addresses: addressses
            }
            var url = "/deployandmintnft_v2"
            
            $.ajax({
                type: "POST",
                url: url,
                // The key needs to match your method's input parameter (case-sensitive).
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    $.showNotification({
                        body:"<h3>" + data.message + "</h3>",
                        duration: 300000,
                        maxWidth:"820px",
                        shadow:"0 2px 6px rgba(0,0,0,0.2)",
                        zIndex: 100,
                        margin:"1rem"
                    })
                },
                error: function(errMsg) {
                    console.log(errMsg);
                }
            });
        }
    ) 

    function success(result, status){
        console.log("In success");
        console.log(result);
        console.log(status);
    }

});