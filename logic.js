// title layers
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// URL
d3.json(link, function(data) {
  Features(data.features);
});

function Features(earthquakefeatures) {
  // 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Where: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
  }

  //
  function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: Colors(feature.properties.mag),
        color: Colors(feature.properties.mag),
        weight: 1,
        opacity: .8,
        fillOpacity: 0.35
    }
    return L.circleMarker(latlng, options);
}
  
  let markers = L.geoJSON(earthquakefeatures, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  
  myearthMap(markers);
}

// Colors
function Colors(mag) {
  switch(true) {
      case (-1.0 <= mag && mag <= 1.0):
        return "#CCFB5D";
      case (1.0 <= mag && mag <= 3.0):
        return "#8EEBEC";
      case (3.0 <= mag && mag <= 5.0):
        return "#D462FF";
      case (5.0 <= mag && mag <= 7.0):
        return "#F8B88B";
      case (7.0 <= mag && mag <= 9.0):
        return "#F62817";
        case (9.0 <= mag ):
          return "#C32148";
      default:
        return "#E2FFAE";
  }
}

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-1.0, 1.0, 3.0, 5.0, 7.0, 9.0],
        labels = [];


    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + Colors(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

function myearthMap(markers) {

  let baseMaps = {
    "Street Map": streetmap,
  };

  let overlayMaps = {
    Earthquakes: markers
  };

  // 
  let myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 4,
    layers: [streetmap, markers]
  });
  // Add the layer 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}