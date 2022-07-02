export default class Map {
    api = {};
    loader = {};
    infowindow = {};
    placesService = {};
    markerClusterer = {};
    map = {
        object: {},
        apiKey: import.meta.env.VITE_MAP_API_KEY,
        container: document.getElementById('map'),
        center: {
            latitude: parseFloat(import.meta.env.VITE_MAP_CENTER_LATITUDE),
            longitude: parseFloat(import.meta.env.VITE_MAP_CENTER_LONGITUDE),
        },
        zoom: Math.round(Math.log(window.screen.width / 512)) + 9,
    };


    constructor(api, loader, controls, markerClusterer) {
        this.api = api;
        this.loader = loader;
        this.markerClusterer = markerClusterer;

        Promise.all([
            this.loadMap(),
            this.api.index(),
        ]).then(([map, data]) => {
            this.map.object = map;

            this.infowindow = new google.maps.InfoWindow();

            this.placesService = new google.maps.places.PlacesService(this.map.object);

            map.controls[google.maps.ControlPosition.TOP_CENTER].push(controls.getControls());

            this.run(data.data)
        })
    }


    run(data) {
        const markers = this.createMarkers(data, this.map.object)

        new this.markerClusterer({map: this.map.object, markers: markers});
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
        });
    };


    createMarkers(data, map) {
        return data.map(item => {
            const marker = new google.maps.Marker({map: map, position: new google.maps.LatLng(...item.position)});

            marker.addListener('click', async () => {
                const details = await this.loadDetails(item);
                this.showInfoWindow(details, marker, map)
            });

            return marker;
        })
    };


    async loadDetails(item) {
        let details = sessionStorage.getItem(item.position.join());

        if (details === null) {
            details = await this.loadDetailsFromProvider(item);
            sessionStorage.setItem(item.position.join(), JSON.stringify(details))

            return details
        }

        return JSON.parse(details);
    };


    loadDetailsFromProvider(item) {
        const request = {
            placeId: item.placeId,
            fields: ['formatted_address', 'url'],
        }

        return new Promise((resolve) => {
                this.placesService.getDetails(request, (place, status) => {
                    if (place && status === google.maps.places.PlacesServiceStatus.OK) {
                        item.formatted_address = place.formatted_address
                        item.url = place.url

                        resolve(item)
                    }
                })
            }
        )
    };


    showInfoWindow(item, marker, map) {
        this.infowindow.setContent(`
        <div class="poi-info-window">
            <p class="title full-width">${item.name}</p>
            <p class="description full-width">${item.description}</p>
            <p class="address full-width">${item.formatted_address}</p>
            <p class="view-link"><a href="${item.url}" target="_blank">View on Google Maps</a></p>
        </div>`
        )

        this.infowindow.setPosition(marker.position)
        this.infowindow.setOptions({pixelOffset: {height: -42}})
        this.infowindow.open(map)
    };
};
