export default class ItemDto {
    #placeId = '';
    #name = '';
    #description = '';
    #formattedAddress = '';
    #url = '';


    constructor(placeId, name, description) {
        this.#placeId = placeId;
        this.#name = name;
        this.#description = description;
    }


    get placeId() {
        return this.#placeId;
    }

    set placeId(value) {
        this.#placeId = value;
    }


    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }


    get description() {
        return this.#description;
    }

    set description(value) {
        this.#description = value;
    }


    get formattedAddress() {
        return this.#formattedAddress;
    }

    set formattedAddress(value) {
        this.#formattedAddress = value;
    }


    get url() {
        return this.#url;
    }

    set url(value) {
        this.#url = value;
    }
}
