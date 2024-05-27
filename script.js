// Initialiser la carte avec la projection Lambert 93
var crs = new L.Proj.CRS('EPSG:2154',
    '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
        origin: [0, 0],
        bounds: L.bounds([0, 0], [700000, 6600000])
    }
);

// Créer la carte en utilisant la projection Lambert 93
var map = L.map('map', {
    crs: crs,
    center: [6600000, 700000], // Coordonnées approximatives du centre de la France en Lambert 93
    zoom: 6
});

// Ajouter une couche de base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Charger et afficher les données géospatiales
fetch('geojson/BV_Stations.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    className: 'bv-station' // Ajouter la classe CSS aux stations
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
                    var pdfUrl = '/pdfs/' + feature.properties.link; // Corriger le chemin vers le dossier PDF
                    layer.bindPopup('<a href="' + pdfUrl + '" target="_blank">Voir le PDF</a>');
                }
            }
        }).addTo(map);
    });
