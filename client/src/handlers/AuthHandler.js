import AuthRepository from '../repositories/AuthRepository.js'
import AuthService from '../services/AuthService.js'

const authRepository = new AuthRepository(`${process.env.HOST}`, `${process.env.CREDENTIALS_FILE}`)
const authService = new AuthService(authRepository)

export default class AuthHandler {

    /**
     * @param {*} req 
     */
    static async login(req) {
        try {
            await authService.login(req)

            console.log("Session initialized successfully!!!")
        } catch(e) {
            console.error(e.message)
        }
    }

}