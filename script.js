// Définir la projection Lambert 93
var crs = new L.Proj.CRS('EPSG:2154',
    '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
        origin: [0, 0],
        bounds: L.bounds([0, 0], [700000, 6600000])
    }
);

// Initialiser la carte avec la projection Lambert 93
var map = L.map('map', {
    crs: crs
}).setView([46.2276, 2.2137], 6); // Centré sur la France

// Ajouter une couche de base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Charger la couche BV_Stations avec la projection Lambert 93
fetch('geojson/BV_Stations.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            crs: crs // Spécifier la projection Lambert 93
        }).addTo(map);
    });

// Charger la couche réseau hydrographique avec la projection Lambert 93
fetch('geojson/reseau_hydrographique.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            crs: crs // Spécifier la projection Lambert 93
        }).addTo(map);
    });

// Charger la couche des stations avec la projection Lambert 93 et popups
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
                if (feature.properties && feature.properties.CdStationH) {
                    layer.bindPopup('<a href="' + feature.properties.link + '" target="_blank">Voir le PDF</a>');
                }
            },
            crs: crs // Spécifier la projection Lambert 93
        }).addTo(map);
    });

