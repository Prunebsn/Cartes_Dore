// Initialiser la carte
var map = L.map('map').setView([45.571, 3.64], 12);

// Ajouter un contrôle personnalisé pour le lien PDF
L.Control.LisezMoi = L.Control.extend({
    onAdd: function(map) {
        var div = L.DomUtil.create('div', 'leaflet-control-lisez-moi');
        div.innerHTML = '<a href="/Cartes_Dore/Notice.pdf" target="_blank">Lisez Moi</a>';
        return div;
    },

    onRemove: function(map) {
        // Rien à faire ici
    }
});


// Ajouter le contrôle à la carte
L.control.lisezMoi = function(opts) {
    return new L.Control.LisezMoi(opts);
}

L.control.lisezMoi({ position: 'topright' }).addTo(map);

// Ajouter le grand titre au-dessus de la carte avec une case blanche en arrière-plan
var mapTitleContainer = document.createElement('div');
mapTitleContainer.style.position = 'absolute';
mapTitleContainer.style.top = '20px';
mapTitleContainer.style.left = '20px';
mapTitleContainer.style.padding = '10px';
mapTitleContainer.style.backgroundColor = 'white'; // Fond blanc
mapTitleContainer.style.borderRadius = '5px'; // Coins arrondis
mapTitleContainer.style.zIndex = '1000'; // Assure que le titre soit au-dessus de la carte

var mapTitle = document.createElement('h1');
mapTitle.textContent = 'Restitution de la modélisation hydrologique des stations hydrométriques de la Dore.';
mapTitle.style.fontSize = '24px';
mapTitle.style.fontWeight = 'bold';
mapTitleContainer.appendChild(mapTitle);

document.body.appendChild(mapTitleContainer);

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
                // Récupérer la valeur de ClassCESAM
                var importance = feature.properties.ClassCESAM;
                console.log('ClassCESAM:', importance); // Log the value of ClassCESAM

                // Définir la classe CSS en fonction de la valeur de ClassCESAM
                var classToAdd;

                // Déterminer la classe à ajouter en fonction de la valeur de la table attributaire
                if (importance === '1') {
                    classToAdd = 'reseau-hydrographique-1';
                } else if (importance === '2') {
                    classToAdd = 'reseau-hydrographique-2';
                } else if (importance === '3') {
                    classToAdd = 'reseau-hydrographique-3';
                } else {
                    classToAdd = 'reseau-hydrographique-NULL';
                }

                console.log('Class to add:', classToAdd); // Log the class to add

                // Ajouter la classe au réseau hydrographique
                return {
                    className: classToAdd
                };
            },
            onEachFeature: function (feature, layer) {
                // Ajouter une popup qui affiche la valeur de la colonne "TOPONYME"
                var toponyme = feature.properties.TOPONYME;
                layer.bindPopup(toponyme);
            }
        }).addTo(map);
    });

// Charger la couche des stations avec la projection Lambert 93 et popups
fetch('geojson/Stations_2.geojson')
    .then(response => response.json())
    .then(data => {
        var stationsLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { className: 'station-maker' });
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.link) {
                    // Concaténer le chemin du dossier PDF avec la valeur de la propriété 'link'
                    var pdfUrl = '/Cartes_Dore/pdf/' + feature.properties.link + '.pdf';
                    var stationsName = feature.properties.CdStationH + ' : ' + feature.properties.LbStationH;
                    layer.bindPopup('<a href="' + pdfUrl + '" target="_blank">' + stationsName + '</a>');
                }
            }
        });

        // Ajouter la couche des stations au-dessus des autres couches
        stationsLayer.addTo(map);
    });
