// Initialiser la carte
var map = L.map('map').setView([46.2276, 2.2137], 6); // Centré sur la France initialement

// Ajouter une couche de base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Fonction pour styliser la couche BV_Stations
function styleBVStations(feature) {
    return {
        color: 'black',
        weight: 2,
        fillOpacity: 0
    };
}

// Charger les données GeoJSON pour BV_Stations et centrer la carte sur cette couche
fetch('geojson/BV_Stations.geojson')
    .then(response => response.json())
    .then(data => {
        var bvStationsLayer = L.geoJSON(data, {
            style: styleBVStations
        }).addTo(map);
        map.fitBounds(bvStationsLayer.getBounds());
    });

// Fonction pour styliser la couche reseau_hydrographique
function styleReseauHydrographique(feature) {
    var importance = feature.properties.IMPORTANCE;
    var weight = 6 - importance; // 1 -> 5, 2 -> 4, etc.
    return {
        color: 'blue',
        weight: weight
    };
}

// Charger les données GeoJSON pour reseau_hydrographique
fetch('geojson/reseau_hydrographique.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: styleReseauHydrographique
        }).addTo(map);
    });

// Fonction pour créer des points interactifs avec des étiquettes pour les stations
function onEachStation(feature, layer) {
    if (feature.properties && feature.properties.link) {
        layer.bindPopup('<a href="' + feature.properties.link + '" target="_blank">Voir le PDF</a>');
    }
    if (feature.properties && feature.properties.CdStationH) {
        layer.bindTooltip(feature.properties.CdStationH, { permanent: true, direction: "top" });
    }
}

// Charger les données GeoJSON pour Stations
fetch('geojson/Stations.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: onEachStation,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);
    });
