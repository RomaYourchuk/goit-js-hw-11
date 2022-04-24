import axios from 'axios';

export default class fetchImages {
    constructor() {
        this.options = {
            params: {
                key: '26725888-a7a5e68057d29786ee7f2eeaf',
                q: '',
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: 1,
                per_page: 40,
            },
        };
    }

    async getPictures() {
        const response = await axios.get('https://pixabay.com/api/', this.options);
        this.incrementPage();
        return response;
    }

    incrementPage() {
        this.options.params.page += 1;
    }

    resetPage() {
        this.pageNumber = 1;
    }

    get searchQuery() {
        return this.options.params.q;
    }

    set searchQuery(newQuery) {
        this.options.params.q = newQuery;
    }

    get pageNumber() {
        return this.options.params.page;
    }

    set pageNumber(newNumber) {
        this.options.params.page = newNumber;
    }
}
