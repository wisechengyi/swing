/**
 * Created by yicheng3 on 3/23/14.
 */

/**
 * google map globals
 */
var directionsDisplay;
var directionsService;
var geocoder;
var map;



//var sampleNum = 5;
var businessesToDisplay=[];
var origin='';
var dest ='';
var serverIP="http://54.187.220.65";
//var serverIP = window.location.host;
//var serverIP="http://localhost";
var GLOB_directRouteTime=0;


google.maps.event.addDomListener(window, 'load',function initialize() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(37.7699298, -122.4469157)
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


});


function calcRoute(pointA,pointB, swingBy) {
    origin=pointA;
    dest = pointB;
    var yelpQueries=[];
    var request = {
        origin: pointA,
        destination: pointB,
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL

    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
//                    var route0 = response.routes[0];
//                    response.routes[0]=response.routes[1];
//                    response.routes[1]=route0;
            console.log(response);



            //route 0, the first route
            var routeNum = 0;
            var totalDistanceInKm = response.routes[routeNum].legs[0].distance.value;
            var sampleNum = Math.max(2, Math.floor(totalDistanceInKm/5000));
            console.log("sample number: ",sampleNum);

            GLOB_directRouteTime = response.routes[routeNum].legs[0].duration.value;
            directionsDisplay.setDirections(response);

            var numPoints = response.routes[routeNum].overview_path.length;
            for (var i=numPoints-1;i>=0;i-=Math.floor(numPoints/sampleNum)){
                var longitude = parseFloat(response.routes[routeNum].overview_path[i].B);
                var latitude = parseFloat(response.routes[routeNum].overview_path[i].k);
                yelpQueries.push({"lat":latitude,"lng":longitude, "swingBy":swingBy});
                directionsDisplay.setMap(map);
            }
//                    console.log(yelpQueries);

            queryYelpWithPositions(yelpQueries);
        }
    });
}

//query consists of latitude, longitude, swingby
function queryYelpWithPositions(queries){

    for (var i=0;i<queries.length;i++){
        $.get(
            serverIP+':8080',
            queries[i],
            function(results){
                var json_result = JSON.parse(results);
                console.log(json_result);
                markResults(json_result);
            }
        );
    }
}


var myItv = setInterval(function(){
    displayWithTimeInterval();
},1500);

function average(a) {
    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
    for(var m, s = 0, l = t; l--; s += a[l]);
    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
    return r.deviation = Math.sqrt(r.variance = s / t), r;
}

var lastDisplayIndex=0;
function displayWithTimeInterval(){
    remark();
    if (businessesToDisplay.length>lastDisplayIndex){
        var business = businessesToDisplay[lastDisplayIndex];
        var address = business.location.display_address.join(", ");
        var bizUrl = business.mobile_url;
        lastDisplayIndex++;

        geocoder.geocode({ 'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {



                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                business.marker = marker;

                google.maps.event.addListener(marker, 'click', function () {
                    window.open(bizUrl,'_blank');
                });
                business.geocode = results[0].geometry.location;
                getFirstHalfTime(origin,business, dest);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
//        clearInterval(myItv);
    }
//    if (lastDisplayIndex == businessesToDisplay.length)  clearInterval(myItv); //all the businesses are on display
    if ($("#resultsTable > tbody:last tr").length == businessesToDisplay.length && businessesToDisplay.length!=0) {
        clearInterval(myItv);
    }

}

//change the marker color indicate good/bad results
function remark(){
    var bizTimes=[];
    for (var i=0;i<businessesToDisplay.length;i++){
        if (businessesToDisplay[i].timeNeeded!=undefined && businessesToDisplay[i].timeNeeded.length==2)
            bizTimes.push(businessesToDisplay[i].timeNeeded[0]
                            +businessesToDisplay[i].timeNeeded[1]
                            -GLOB_directRouteTime);
    }
    if (bizTimes.length==0) return;

    var x = average(bizTimes);
    console.log(x);



    for (var i=0;i<businessesToDisplay.length;i++){
        var markerPic='';
        if (businessesToDisplay[i].timeNeeded==undefined || businessesToDisplay[i].length<2){
            markerPic = "greyMarker.png";
//            businessesToDisplay[i].marker.setIcon(dir+markerPic);
            return;
        }
        var stdUnit = (businessesToDisplay[i].timeNeeded[0]+businessesToDisplay[i].timeNeeded[1]-GLOB_directRouteTime- x.mean)/ x.deviation;
        if (stdUnit<-.5){
            markerPic = "greenMarker.png";
        }
        else if (stdUnit>.5){
            markerPic="redMarker.png";
        }
        else{
            markerPic="orangeMarker.png";
        }
        if (businessesToDisplay[i].marker.getIcon()!=(markerPic)) businessesToDisplay[i].marker.setIcon(markerPic);
    }

}

//get time from point A to business, then call the function to get the time from business to point B
function getFirstHalfTime(pointA, business, pointB){

    var request = {
        origin: pointA,
        destination: business.geocode,
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
//                    var route0 = response.routes[0];
//                    response.routes[0]=response.routes[1];
//                    response.routes[1]=route0;

            console.log(response);
//            directionsDisplay.setDirections(response);
            if (business.timeNeeded==undefined){
                business.timeNeeded=[];
                business.timeNeeded.push(response.routes[0].legs[0].duration.value);
            }
            getSecondHalfTime(business,pointB);
        }
    });

}

function getSecondHalfTime(business, pointB){

    var request = {
        origin: business.geocode,
        destination: pointB,
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            business.timeNeeded.push(response.routes[0].legs[0].duration.value);
            console.log("total time to this business: ",business.timeNeeded[0], business.timeNeeded[1]);
            addToResultsTable(business)
        }
    });

}

function addToResultsTable(business){
    $('#queryinfo').hide();
    $('#resultsTable').show();
    timeA = business.timeNeeded[0];
    timeB = business.timeNeeded[1];
    if (business.timeNeeded.length>2) console.error("business error, more times than expected")

    var link = $('<a>')                      // Creates the element
        .attr('href',business.mobile_url) // Sets the attribute spry:region="myDs"
        .attr('target','_blank')
        .attr('class','business')
        .attr('displayIndex',business.displayIndex)
        .append(business.name);
    console.log(link.get(0).outerHTML);

    $('#resultsTable > tbody:last').append('<tr>'
        +'<td>'+link.get(0).outerHTML+'</td>'
        +'<td>'+ timeA.toString().toHHMMSS() + '</td>'
        +'<td>' + timeB.toString().toHHMMSS() + '</td>'
        +'<td>'+ (timeA+timeB).toString().toHHMMSS() +'</td></tr>');
    $("#resultsTable").trigger("update"); //make table sortable
    $("a.business").mouseover(function(){
        var index = $(this).attr('displayIndex');
        enlargeMarker(index);
//        console.log($(this).attr('displayIndex'));


    });


}

function enlargeMarker(index){
    var currentMarker = businessesToDisplay[index].marker;
    if (currentMarker.getIcon().indexOf("green")>-1){
        currentMarker.setIcon("greenMarker2.png");
    }
    else if (currentMarker.getIcon().indexOf("red")>-1){
        currentMarker.setIcon("redMarker2.png");
    }
    else if (currentMarker.getIcon().indexOf("orange")>-1){
        currentMarker.setIcon("orangeMarker2.png");
    }

    for (var i=0;i<businessesToDisplay.length;i++){
        if (i!=index){
            compressMarker(i);
        }
    }
}

function compressMarker(index){
    var currentMarker = businessesToDisplay[index].marker;
    if (currentMarker.getIcon().indexOf("green")>-1){
        currentMarker.setIcon("greenMarker.png");
    }
    else if (currentMarker.getIcon().indexOf("red")>-1){
        currentMarker.setIcon("redMarker.png");
    }
    else if (currentMarker.getIcon().indexOf("orange")>-1){
        currentMarker.setIcon("orangeMarker.png");
    }
}


var existingBusinesses={};
function markResults(results){
    for (var i=0;i<results.businesses.length;i++){
        if (existingBusinesses[results.businesses[i].id]==undefined){
            existingBusinesses[results.businesses[i].id]=true;
            businessesToDisplay.push(results.businesses[i]);
            businessesToDisplay[businessesToDisplay.length-1].displayIndex=businessesToDisplay.length-1;
        }
        else{
            console.log("duplicates: ",results.businesses[i].id);
        }
    }

}


String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

//    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes;
    return time;
}


$( document ).ready(function() {
    $('#fbform').attr('action',serverIP + ":8000/")

});


