/**
 * @typedef {object} AuthRepository
 * @property {function(object):void} saveCredentials
 * @property {function(object):Promise<object>} login
 * @property {function():object} readCredentials
 */
export default class AuthService {

    /**
     * 
     * @param {AuthRepository} authRepository 
     */
    constructor(authRepository) {
        this.authRepository = authRepository
    }

    /**
     * 
     * @param {object} req 
     * @param {string} req.email 
     * @param {string} req.pass 
     */
    async login(req) {
        if (req?.email == "" || req?.pass == "") {
            throw Error("Invalid email or password")
        }

        const response = await this.authRepository.login(req)

        const base64Payload = response.token.split(".")[1]
        const decodedPayload = Buffer.from(base64Payload, 'base64').toString()
        const payload = JSON.parse(decodedPayload)
        
        this.authRepository.saveCredentials({
            token: response.token,
            expiresAt: payload.exp
        })
    }

}