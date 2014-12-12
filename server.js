/**
 * Created by yicheng3 on 3/24/14.
 */
var yelp = require("yelp").createClient({
    consumer_key: "KdT0yT_-m3yVEWoLm0-l9A",
    consumer_secret: "6ECPZTahZsZj0mUrfGdytqzV-pg",
    token: "0JsP7tr7SPIBykUXJW7pUnHqAQuMcIoR",
    token_secret: "FYhAyXw1X9P4PEGxsiAV0xz0Eyg"
});

var sys = require("sys"),
    my_http = require("http"),
    fileSystem = require('fs');
my_http.createServer(function (request, response) {


    query = getUrlVars(request.url);
//	console.log(query);
    response.setHeader('Access-Control-Allow-Origin', '*');
    if (query.lat==undefined || query.lng==undefined){
	        response.write("{error:\"no location info\"")
                response.end();
		return;
	}
    sys.puts("request accepted");
    // Request methods you wish to allow
//    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//    // Request headers you wish to allow
//    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//    // Set to true if you need the website to include cookies in the requests sent
//    // to the API (e.g. in case you use sessions)
//    response.setHeader('Access-Control-Allow-Credentials', true);
//    var data = {a: 1, b: 2};


//    console.log(query);
    //yelp.search({ ll: query.lat + ',' + query.lng, term: query.swingBy, limit: 3}, function (error, data) {

    var params = { ll: query.lat + ',' + query.lng, term: query.swingBy.replace(/([^\w])/g, ' '), limit: 3}
//	console.log(params)
    yelp.search( params , function (error, data) {
        if (error) { 
		console.log(error);
		response.write("{error:\"some error\"")
		response.end();
	}
	else{
        response.write(JSON.stringify(data));
        response.end();
	}
    });
//    // See http://www.yelp.com/developers/documentation/v2/search_api
//    yelp.search({term: "food", location: "Montreal"}, function(error, data) {
//        response.write(JSON.stringify(data));
//        response.end();
//    });


}).listen(8080);
sys.puts("Server Running on 8080");



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


//

//
//// See http://www.yelp.com/developers/documentation/v2/business
//yelp.business("yelp-san-francisco", function(error, data) {
//    console.log(error);
//    console.log(data);
//});
