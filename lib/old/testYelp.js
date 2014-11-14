// Request API access: http://www.yelp.com/developers/getting_started/api_access

var yelp = require("yelp").createClient({
    consumer_key: "KdT0yT_-m3yVEWoLm0-l9A",
    consumer_secret: "6ECPZTahZsZj0mUrfGdytqzV-pg",
    token: "kgabnaeaRnTyLSpaZowZWky2skdH_lzI",
    token_secret: "50yeGPq4Lo0MVnZCxtDc0RsSsd0"
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


