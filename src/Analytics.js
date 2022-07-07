export default class Analytics {
    trackInfoWindow(id, name, placeId) {
        gtag('event', 'view_item', {
            currency: 'EUR',
            value: 1,
            items: [
                {
                    item_id: id,
                    item_name: name,
                    location_id: placeId,
                }
            ]
        });
    }
};
