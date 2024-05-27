// Initialiser la carte
var map = L.map('map').setView([46.2276, 2.2137], 6); // Centré sur la France

// Ajouter une couche de base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Charger les données GeoJSON
fetch('geojson/BV_Stations.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    });

fetch('geojson/reseau_hydrographique.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    });

fetch('geojson/Stations.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.link) {
                    layer.bindPopup('<a href="' + feature.properties.link + '" target="_blank">Voir le PDF</a>');
                }
            }
        }).addTo(map);
    });
