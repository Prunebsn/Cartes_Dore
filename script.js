// Initialiser la carte avec Leaflet sans spécifier de projection
var map = L.map('map');

// Ajouter une couche de base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Centrer la carte sur un emplacement spécifique
map.setView([51.505, -0.09], 13);

// Charger et afficher les données géospatiales
fetch('geojson/BV_Stations.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    className: 'BV_Stations' // Ajouter la classe CSS aux stations
                };
            }
        }).addTo(map);
    });

// Charger et afficher la couche réseau hydrographique
fetch('geojson/reseau_hydrographique.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    className: 'reseau-hydrographique' // Ajouter la classe CSS au réseau hydrographique
                };
            }
        }).addTo(map);
    });

// Charger et afficher la couche des stations avec des popups
fetch('geojson/Stations.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: '#ff7800',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.link) {
                    var pdfUrl = '/pdf/' + feature.properties.link;
                    layer.bindPopup('<a href="' + pdfUrl + '" target="_blank">Voir le PDF</a>');
                }
            }
        }).addTo(map);
    });
