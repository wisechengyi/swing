
<!DOCTYPE html>
<html>
<head>
    <?php include 'example.php'; ?>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <style type="text/css">
        html { height: 100% }
        body { height: 100%; margin: 0; padding: 0 }
        #map-canvas { height: 100%}
    </style>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

    <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHAt76UqrnV9QeM7LsaegVzW3bQLA9hHk&sensor=true">
    </script>
    <script type="text/javascript" src="../../map.js">

    </script>

    <script type="text/javascript" >

               $.ajax({
                   url: "example.php&f=yelp",
                   type: "GET"
                   success: function(data){
                       //Do something here with the "data"
                       console.log(data);
                   }
               });


    </script>

</head>
<body>
<div id="map-canvas"/>

</body>
</html>