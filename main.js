
// Load map
var map = L.map('map').setView([50.5763342, 4.6171586], 8);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Var to hold currently selected province 
var selected;

// Highlight a new province
function highlightFeature(e) {
    var layer = e.target;

    // Unless one is selected
    if (selected && e.target._leaflet_id == selected.target._leaflet_id) {
        return;
    }

    layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Reset highlighting
function resetHighlight(e) {
    if (selected && e.target._leaflet_id == selected.target._leaflet_id) {
        return;
    }

    myLayer.resetStyle(e.target);
}

// Zoom to clicked province
function zoomToFeature(e) {
    // Save previous
    previous = selected;
    selected = e;

    // Reset old one
    if (previous) {
        resetHighlight(previous);
    }

    // Remove style
    e.target.setStyle({
        weight: 3,
        color: '#fff',
        dashArray: '',
        fillOpacity: 0
    });

    map.fitBounds(e.target.getBounds());
}

// Add events to features (provinces)
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Add layer with distinct style to display provinces
var myLayer = L.geoJson(undefined, {
    style: function(feature) {
        return {
            fillColor: "#fff",
            weight: 1,
            opacity: 1,
            color: '#333',
            dashArray: '5',
            fillOpacity: 0.7
        };
    },
    onEachFeature: onEachFeature
}).addTo(map);

// Load province data
$.getJSON("/features.geojson", function(json){
    myLayer.addData(json);
});
