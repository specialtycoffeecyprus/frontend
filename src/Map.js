import ItemDto from "./ItemDto";

export default class Map {
    loader = {};
    infowindow = {};
    placesService = {};
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
        zoom: Math.round(Math.log(window.screen.width / 512)) + 9,
    };


    constructor(loader, controls, markerClusterer, analytics) {
        this.loader = loader;
        this.markerClusterer = markerClusterer;
        this.analytics = analytics;

        this.loadMap().then(async map => {
            this.infowindow = new google.maps.InfoWindow();
            this.placesService = new google.maps.places.PlacesService(map);

            map.controls[google.maps.ControlPosition.TOP_CENTER].push(controls.getControls());

            const features = await this.loadData(this.dataUrl, map);
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
        });
    };


    loadData(url, map) {
        return new Promise((resolve) => {
                map.data.setMap(null)

                map.data.loadGeoJson(url, {}, (features) => {
                    resolve(features)
                })
            }
        )
    }


    createMarkers(features, map) {
        return features.map(feature => {
            const details = new ItemDto(
                feature.getProperty('placeId'),
                feature.getProperty('name'),
                feature.getProperty('description')
            );

            const marker = new google.maps.Marker({position: feature.getGeometry().get()});

            marker.addListener('click', async () => this.showInfoWindow(await this.enrichDetails(details), marker.position, map));

            return marker;
        });
    }


    async enrichDetails(itemDto) {
        let details = sessionStorage.getItem(itemDto.placeId);

        if (details !== null) {
            details = JSON.parse(details);
        } else {
            details = await this.loadDetailsFromProvider(itemDto.placeId);
            sessionStorage.setItem(itemDto.placeId, JSON.stringify(details))
        }

        if (details === null) {
            return itemDto
        }

        itemDto.formattedAddress = details.formatted_address
        itemDto.url = details.url

        return itemDto
    };


    loadDetailsFromProvider(placeId) {
        const request = {
            placeId: placeId,
            fields: ['formatted_address', 'url'],
        }

        return new Promise((resolve) => {
                this.placesService.getDetails(request, (place, status) => {
                    if (place && status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve({
                            formatted_address: place.formatted_address,
                            url: place.url
                        })
                    }
                })
            }
        )
    };


    showInfoWindow(itemDto, position, map) {
        this.infowindow.setContent(`
            <div class="poi-info-window">
                <p class="title full-width">${itemDto.name}</p>
                <p class="description full-width">${itemDto.description}</p>
                <p class="address full-width">${itemDto.formattedAddress}</p>
                <p class="view-link"><a href="${itemDto.url}" target="_blank">View on Google Maps</a></p>
            </div>
        `)

        this.infowindow.setPosition(position)
        this.infowindow.setOptions({pixelOffset: {height: -42}})
        this.infowindow.open({map, shouldFocus: false})

        this.analytics.trackInfoWindow(itemDto.placeId, itemDto.name, itemDto.placeId);
    };
};
