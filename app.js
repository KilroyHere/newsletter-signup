require("dotenv").config();
const express = require("express");
const https = require("https");
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const listId = process.env.LIST_ID;
    const ApiKey = process.env.API_KEY;
    const serverNumber = process.env.SERVER_NUMBER;
    const url = `https://us${serverNumber}.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "POST",
        auth: `johnDoe:${ApiKey}`
    };

    const request = https.request(url,options,function(response){
        const status = response.statusCode;
        if(status === 200){
            res.sendFile(__dirname+"/success.html");
        } 
        else {
            console.log(status);    
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            const chimpResponse = JSON.parse(data);
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.post("/success",function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 4000,function(){
    console.log("Server running at port 4000");
});

