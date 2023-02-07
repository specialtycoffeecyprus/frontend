import ItemDto from "./ItemDto";
import isMobile from "./isMobile";

export default class Map {
    loader = {};
    infowindow = {};
    markerClusterer = {};
    analytics = {};
    dataUrl = import.meta.env.VITE_API_URL;
    map = {
        apiKey: import.meta.env.VITE_MAP_API_KEY,
        container: document.getElementById('map'),
        center: {
            latitude: parseFloat(import.meta.env.VITE_MAP_CENTER_LATITUDE),
            longitude: parseFloat(import.meta.env.VITE_MAP_CENTER_LONGITUDE),
        },
        zoom: Math.log(window.screen.width / 512) + (isMobile ? 8.5 : 9),
    };


    constructor({loader, controls, markerClusterer, analytics}) {
        this.loader = loader;
        this.markerClusterer = markerClusterer;
        this.analytics = analytics;

        Promise.all([this.loadMap(), this.loadData()]).then(([map, data]) => {
            this.infowindow = new google.maps.InfoWindow();

            map.controls[google.maps.ControlPosition.TOP_CENTER].push(controls.getControls());

            map.data.setMap(null)

            const features = map.data.addGeoJson(data);
            const markers = this.createMarkers(features, map);

            new this.markerClusterer({map: map, markers: markers});
        })
    }


    async loadMap() {
        const google = await new this.loader({
            apiKey: this.map.apiKey,
            libraries: ['places'],
        })
            .load();

        return new google.maps.Map(this.map.container, {
            center: {
                lat: this.map.center.latitude,
                lng: this.map.center.longitude,
            },
            zoom: this.map.zoom,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false,
        });
    };


    loadData() {
        return fetch(this.dataUrl).then(response => {
            if (!response.ok) {
                throw new Error(`${response.url} ${response.status} ${response.statusText}`);
            }

            return response.json();
        })
    }


    createMarkers(features, map) {
        return features.map(feature => {
            const details = new ItemDto({
                    id: parseInt(feature.getProperty('id')),
                    name: feature.getProperty('name'),
                    description: feature.getProperty('description'),
                    region: feature.getProperty('region'),
                    placeId: feature.getProperty('placeId'),
                    url: feature.getProperty('url'),
                }
            );

            const marker = new google.maps.Marker({
                label: {
                    className: 'marker-label',
                    text: details.name
                },
                icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png',
                title: details.name,
                position: feature.getGeometry().get()
            });

            marker.addListener('click', () => this.showInfoWindow(details, marker.position, map));

            return marker;
        });
    }


    showInfoWindow(itemDto, position, map) {
        this.infowindow.setContent(`
            <div class="poi-info-window">
                <p class="title full-width">${itemDto.name}</p>
                <p class="description full-width">${itemDto.description}</p>
                <p class="view-link"><a href="${itemDto.url}" target="_blank">View on Google Maps</a></p>
            </div>
        `)

        this.infowindow.setPosition(position)
        this.infowindow.setOptions({pixelOffset: {height: -42}})
        this.infowindow.open({map, shouldFocus: false})

        this.analytics.trackInfoWindow(itemDto.id, itemDto.name, itemDto.placeId);
    };
};
