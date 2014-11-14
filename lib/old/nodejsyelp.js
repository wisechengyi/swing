// Request API access: http://www.yelp.com/developers/getting_started/api_access

var yelp = require("yelp").createClient({
  consumer_key: "KdT0yT_-m3yVEWoLm0-l9A",
  consumer_secret: "6ECPZTahZsZj0mUrfGdytqzV-pg",
  token: "0JsP7tr7SPIBykUXJW7pUnHqAQuMcIoR",
  token_secret: "FYhAyXw1X9P4PEGxsiAV0xz0Eyg"
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({term: "food", location: "Montreal"}, function(error, data) {
    console.log(error);
    console.log(data);
});

// See http://www.yelp.com/developers/documentation/v2/business
yelp.business("yelp-san-francisco", function(error, data) {
    console.log(error);
    console.log(data);
});

console.log("yolo");