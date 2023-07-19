export default class Page {
    #content;
    #index;
    constructor(content, index) {
        this.#content = content;
        this.#index = index;
    }
    getContent() {
        return this.#content;
    }
    setConetnt(content) {
        this.#content = content;
    }
    getIndex() {
        return this.#index;
    }
}