// Initialiser la carte
var map = L.map('map').setView([45.571, 3.64], 12);

// Charger une couche de base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Charger la couche BV_Stations avec la projection Lambert 93
fetch('geojson/BV_Dore.geojson')
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

// Charger la couche réseau hydrographique avec la projection Lambert 93
fetch('geojson/reseau_hydrographique.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                // Récupérer la valeur de IMPORTANCE
                var importance = feature.properties.ClassCESAM;
                // Définir l'épaisseur en fonction de la valeur de IMPORTANCE
                var classToAdd;

                // Déterminez la classe à ajouter en fonction de la valeur de la table attributaire
                if (importance === 1) {
                    classToAdd = 'reseau-hydrographique-1';
                } else if (importance === 2) {
                    classToAdd = 'reseau-hydrographique-2';
                } else if (importance === 3) {
                    classToAdd = 'reseau-hydrographique-3';
                } else {
                    classToAdd = 'reseau-hydrographique-NULL';
                }

                // Ajoutez la classe au réseau hydrographique
                return {
                    className: classToAdd
                };
            }
        }).addTo(map);
    });
// Création d'une icône personnalisée
var myIcon = L.icon({
    iconUrl: '/Cartes_Dore/pin.png',
    iconSize: [38, 95], // Taille de l'icône
    iconAnchor: [22, 94], // Point d'ancrage de l'icône
    popupAnchor: [-3, -76] // Point d'ancrage du popup
});

// Charger la couche des stations avec la projection Lambert 93 et popups
fetch('geojson/Stations_2.geojson')
    .then(response => response.json())
    .then(data => {
        var stationsLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: myIcon });
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.link) {
                    // Concaténer le chemin du dossier PDF avec la valeur de la propriété 'link'
                    var pdfUrl = '/Cartes_Dore/pdf/' + feature.properties.link + '.pdf';
                    var stationsName = feature.properties.CdStationH + ':' + feature.properties.LbStationH;
                    layer.bindPopup('<a href="' + pdfUrl + '" target="_blank">' + stationsName + '</a>');
                }
            }
        });

        // Ajouter la couche des stations au-dessus des autres couches
        stationsLayer.addTo(map);
    });
