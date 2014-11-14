///**
// * Created by yicheng3 on 4/19/14.
// */
var sys = require("sys"),
    my_http = require("http");
var nodemailer = require("nodemailer");


my_http.createServer(function(request,response){
    sys.puts("request accepted");
//    response.writeHeader(200, {"Content-Type": "text/plain"});
    response.setHeader('Access-Control-Allow-Origin', '*');
//    console.log(request);
    var data = getUrlVars(decode(request.url));
    console.log(data);
    if (data.email == undefined || data.email=='') {
        response.write("Invalid email");
        response.end();
        return;
    }

//    var myCopy = JSON.parse(JSON.stringify(data));


//    myCopy.email = "admin@swingit.us";
//    console.log(myCopy, '\n', data);



    sendmail(data);
//    sendmail(myCopy);


    response.write("Thank you very much! A copy has been sent to your email "+ data.email+" as well");
    response.end();

}).listen(8000);
sys.puts("Server Running on 8000");






function sendmail(data){


    var transport = nodemailer.createTransport("direct", {debug: true});
    //nodemailer.mail({
    //    from: "Fred Foo <foo@blurdybloop.com>", // sender address
    //    to: "420420@mailinator.com", // list of receivers
    //    subject: "Hello", // Subject line
    //    text: "Hello world", // plaintext body
    //    html: "<b>Hello world</b>" // html body
    //});


    var messageOptions= {
        from: "admin@swingit.us", // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        text: data.comments, // plaintext body
        html: "<b>"+data.comments+"</b>" // html body
    };

    transport.sendMail(messageOptions, function(error, response){
        if(error){
            console.log(error);
            return;
        }

        // response.statusHandler only applies to 'direct' transport
        response.statusHandler.once("failed", function(data){
            console.log(
                "Permanently failed delivering message to %s with the following response: %s",
                data.domain, data.response);
        });

        response.statusHandler.once("requeue", function(data){
            console.log("Temporarily failed delivering message to %s", data.domain);
        });

        response.statusHandler.once("sent", function(data){
            console.log("Message was accepted by %s", data.domain);
        });
    });

    messageOptions= {
        from: data.email, // sender address
        to: "admin@swingit.us" , // list of receivers
        subject: data.subject, // Subject line
        text: data.comments, // plaintext body
        html: "<b>"+data.comments+"</b>" // html body
    };

    transport.sendMail(messageOptions, function(error, response){
        if(error){
            console.log(error);
            return;
        }

        // response.statusHandler only applies to 'direct' transport
        response.statusHandler.once("failed", function(data){
            console.log(
                "Permanently failed delivering message to %s with the following response: %s",
                data.domain, data.response);
        });

        response.statusHandler.once("requeue", function(data){
            console.log("Temporarily failed delivering message to %s", data.domain);
        });

        response.statusHandler.once("sent", function(data){
            console.log("Message was accepted by %s", data.domain);
        });
    });






}


function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}


function encode() {
    var obj = document.getElementById('dencoder');
    var unencoded = obj.value;
    obj.value = encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
}

function decode(htmlcode) {
//    var obj = document.getElementById('dencoder');
//    var encoded = obj.value;
    return decodeURIComponent(htmlcode.replace(/\+/g,  " "));
}