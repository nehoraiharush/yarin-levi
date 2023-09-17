export default class TrainerComment {
    #name;
    #content;
    #approved

    constructor(name, content) {
        this.#content = content;
        this.#name = name;
        this.#approved = false;
    }

    getName = () => this.#name;

    getContent = () => this.#content;

    isApproved = () => this.#approved;

    setApproval = (approve) => {
        this.#approved = approve;
    }

}