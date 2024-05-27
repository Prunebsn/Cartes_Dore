// Initialiser la carte
var map = L.map('map').setView([51.505, -0.09], 13);

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
fetch('geojson/reseau_hydrographique_2.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                // Récupérer la valeur de IMPORTANCE
                var importance = feature.properties.IMPORTANCE;
                // Définir l'épaisseur en fonction de la valeur de IMPORTANCE
                var weight;
                switch(importance) {
                    case 1:
                        weight = 3; // Par exemple, si IMPORTANCE est 1, l'épaisseur est 5
                        break;
                    case 2:
                        weight = 2.5; // Par exemple, si IMPORTANCE est 2, l'épaisseur est 4
                        break;
                    case 3:
                        weight = 2; // Par exemple, si IMPORTANCE est 3, l'épaisseur est 3
                        break;
                    case 4:
                        weight = 1.5; // Par exemple, si IMPORTANCE est 4, l'épaisseur est 2
                        break;
                    case 5:
                        weight = 1; // Par exemple, si IMPORTANCE est 5, l'épaisseur est 1
                        break;
                    default:
                        weight = 0.5; // Valeur par défaut
                }
                // Retourner le style avec l'épaisseur calculée
                return {
                    color: 'blue', // Couleur des cours d'eau
                    weight: weight // Épaisseur déterminée par IMPORTANCE
                };
            }
        }).addTo(map);
    });

// Charger la couche des stations avec la projection Lambert 93 et popups
fetch('geojson/Stations_2.geojson')
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
                    // Concaténer le chemin du dossier PDF avec la valeur de la propriété 'link'
                    var pdfUrl = '/Cartes_Dore/pdf/' + feature.properties.link + '.pdf';
                    layer.bindPopup('<a href="' + pdfUrl + '" target="_blank">Voir le PDF</a>');
                }
            }
        }).addTo(map);
    });
