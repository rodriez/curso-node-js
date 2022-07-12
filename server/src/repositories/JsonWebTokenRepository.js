import JsonWebToken from 'jsonwebtoken'

/**
 * @typedef {import('../services/UserService').User} User
 * @typedef {import('../services/AuthorizationService').TokenRepository} TokenRepository
 * 
 * 
 * @implements {TokenRepository}
 */
export default class JsonWebTokenRepository {

    /**
     * @param {*} secret 
     * @param {*} algorithm 
     * @param {*} duration 
     */
    constructor(secret, algorithm, duration) {
        this.secret = secret
        this.algorithm = algorithm
        this.duration = duration
    }

    /**
     * 
     * @param {User} user 
     */
    getToken(user) {
        const payload = {
            id: user.id,
            name: user.name,
            iss: user.email
        }

        const options = {
            algorithm: this.algorithm,
            expiresIn: this.duration
        }

        return JsonWebToken.sign(payload, this.secret, options)
    }

    /**
     * @param {string} token 
     */
    validate(token) {
        JsonWebToken.verify(token, this.secret)
    }

}