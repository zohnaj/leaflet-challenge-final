API_KEY= "pk.eyJ1Ijoiem9obmFqIiwiYSI6ImNrNzJqNGo5dDAwNmczbG9ncW16eGRtYzUifQ.FXpXD5X0J-TW_2ZiBKC4mQ"

var lightmap= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

// var outdoormap= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.outdoors",
//     accessToken: API_KEY
// });

var map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 4,
});


lightmap.addTo(map);

var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(url, function(data){
    // console.log(response);
    function earthquake(feature){
        return {
            opacity: 1, 
            fillOpacity: 1,
            fillColor: colorfunction(feature.properties.mag),
            color: "#000000",
            radius: radifunction(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function colorfunction(mag){
        switch(true){
        case mag > 5:
            return "#ff3333";
        case mag > 4: 
            return "#ff8080";
        case mag > 3:
            return "#ffc266";
        case mag > 2:
            return "#ffff99";
        case mag > 1:  
            return "#ccff99";
        default: 
            return "#f2ffe6";
        }
    }

    function radifunction(mag) {
        if (mag===0) {
            return 1;
        }
        return mag * 4;
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: earthquake, 
        onEachFeature: function(feature, layer) {
            layer.bindPopup("mag: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);

    var legend= L.control({
        position: "bottomright"
    });

    legend.onAdd=function() {
        var legendlevel=L.DomUtil.create("div", "info legend");
        
        var scale = [0, 1, 2, 3, 4, 5];
        var colors = ["#ff3333", "#ff8080", "#ffc266", "#ffff99", "#ccff99", "#f2ffe6"];

        for (var i = 0; i < scale.length; i++) {
            legendlevel.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                scale[i] + (scale[i + 1] ? "&ndash;" + scale[i + 1] + "<br>" : "+");
        };
        return legendlevel;
    }

    legend.addTo(map);
});
