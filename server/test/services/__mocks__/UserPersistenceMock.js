export default class userPersistenceMock {
    constructor() {
        this.clean()
    }
    
    getUserById(id) {
        if (this.error) {
            throw this.error
        }

        return this.user
    }

    clean() {
        this.error = null,
        this.user = null
    }
}