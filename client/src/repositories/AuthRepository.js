import got from 'got'
import * as fs from 'fs'
import * as path from 'path'

/**
 * @typedef {import('../services/AuthService').AuthRepository} AuthRepositoryInterface
 * 
 * @implements {AuthRepositoryInterface}
 */
export default class AuthRepository {

    /**
     * 
     * @param {string} host 
     * @param {string} filePath 
     */
    constructor(host, filePath) {
        this.host = host
        this.filePath = filePath
    }

    /**
     * 
     * @param {*} req 
     * @returns {Promise<object>}
     */
    async login(req) {
        try {
            const buff = Buffer.from(`${req.email}:${req.pass}`)
            const response = await got.get(`${this.host}/api/login`, {
                headers: {
                    authorization: `Basic ${buff.toString('base64')}`
                }
            })

            return JSON.parse(response.body)
        } catch(e) {
            const errorBody = JSON.parse(e.response.body)
            throw Error(errorBody.error)
        }
    }

    saveCredentials(credentials) {
        const folder = path.dirname(this.filePath)
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }

        fs.writeFileSync(this.filePath, JSON.stringify(credentials))
    }

    readCredentials() {
        if (fs.existsSync(this.filePath)) {
            const content = fs.readFileSync(this.filePath)
            const creds = JSON.parse(content.toString())

            const now = new Date()
            if (creds.expiresAt > (now.getTime()/1000)) {
                return creds
            }
        }

        throw Error("Session not initialized, please login.")
    }
}