export default class NotFound extends Error {
    constructor(message) {
        super(message)

        this.name = 'NotFound'
    }
}