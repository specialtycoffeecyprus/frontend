export default class ItemDto {
    #id = 0;
    #name = '';
    #description = '';
    #region = '';
    #placeId = '';
    #url = '';


    constructor({id, name, description, region, placeId, url}) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#region = region;
        this.#placeId = placeId;
        this.#url = url;
    }


    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
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


    get region() {
        return this.#region;
    }

    set region(value) {
        this.#region = value;
    }


    get placeId() {
        return this.#placeId;
    }

    set placeId(value) {
        this.#placeId = value;
    }

    get url() {
        return this.#url;
    }

    set url(value) {
        this.#url = value;
    }
}
