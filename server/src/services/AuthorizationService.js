import Forbbiden from '../errors/Forbidden.js'
import Unauthorized from '../errors/Unauthorized.js'
import logger from '../logger.js'

/**
 * @typedef {import('buffer').Buffer} Buffer
 * @typedef {import('../services/UserService').User} User
 * @typedef {import('../services/UserService').UserPersistence} UserPersistence
 * 
 * @typedef {object} BasicCredentials
 * @property {string} email 
 * @property {string} pass
 * 
 * 
 * @typedef {object} TokenRepository
 * @property {function(User):string} getToken
 * @property {function(string):void} validate
 *  
 */
export default class AuthorizationService {

    /**
     * 
     * @param {UserPersistence} userPersistence 
     * @param {TokenRepository} tokenRepository 
     */
    constructor(userPersistence, tokenRepository) {
        /**@private */
        this.userPersistence = userPersistence
        /**@private */
        this.tokenRepository = tokenRepository
    }

    /**
     * 
     * @param {string} hash 
     * @returns {BasicCredentials}
     */
    parseCredentials(hash) {
        const credentials = Buffer.from(hash, 'base64').toString().split(":")

        return {
            email: credentials[0],
            pass: credentials[1]
        }
    }

    /**
     * @param {BasicCredentials} req 
     * 
     * @returns {Promise<String>}
     */
    async login(req) {
        this.checkLoginRequest(req)

        const user = await this.userPersistence.find(req)

        if (!user) {
            logger.error(`FORBIDDEN - User not found - ${req.email}`)

            throw new Forbbiden("Invalid credentials")
        }

        return this.tokenRepository.getToken(user)
    }

    /**@private */
    checkLoginRequest(req) {
        if (req?.email === "" || req?.pass === "") {
            logger.error("FORBIDDEN - Invalid credentials received: empty email or pass")

            throw new Forbbiden("Invalid credentials")
        }
    }


    /**
     * @param {string} token 
     */
    validateToken(token) {
        if (token === "") {
            logger.error("UNAUTHORIZED - Empty Token received")

            throw new Unauthorized("Invalid Token")
        }

        try {
            this.tokenRepository.validate(token)
        } catch(e) {
            logger.error(`${e.name} - An invalid token was received: ${e.message}`)

            throw new Unauthorized("Invalid Token")
        }
    }
}