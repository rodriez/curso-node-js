export default class BadRequest extends Error {
    constructor(message) {
        super(message)

        this.name = 'BadRequest'
    }
}