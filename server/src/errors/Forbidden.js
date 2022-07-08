export default class Forbbiden extends Error {
    constructor(message) {
        super(message)

        this.name = 'Forbidden'
    }
}