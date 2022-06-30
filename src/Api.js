export default class Api {
    baseUrl = import.meta.env.VITE_DATA_API_URL;


    async index() {
        const url = this.baseUrl
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fetch data error ${response.status}`);
        }

        return await response.json();
    };
};
