import got from 'got'

/**
 * @typedef {import('../services/UserService').User} User
 * @typedef {import('../services/UserService').UserPersistence} UserPersistence
 * 
 * @implements {UserPersistence}
 */
export default class UserPersistenceRestRepository {

    constructor(host) {
        this.host = host
    }

    /**
     * @param {User} user 
     */
    async add(user) {
        const response = await got.post(`${this.host}/api/users`, {
            json: user
        })

        return JSON.parse(response.body)
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getUsers() {
        const response = await got.get(`${this.host}/api/users`)
        
        return JSON.parse(response.body)
    }

    /**
     * @param {User} req
     * 
     * @throws {Error} User not found 
     * 
     * @returns {Promise<User>}
     */
    async update(req) {
        const id = req.id
        delete req.id

        const response = await got.patch(`${this.host}/api/users/${id}`, {
            json: req
        })

        return JSON.parse(response.body)
    }

    /**
     * @param {string} id 
     * 
     * @returns {Promise<User>}
     */
    async getUserById(id) {
        const response = await got.get(`${this.host}/api/users/${id}`)
        
        return JSON.parse(response.body)
    }

    /**
     * @param {User} criteria 
     * 
     * @return {Promise<boolean>}
     */
    async exists(criteria) {
        const user = await this.getUserById(`${criteria.id}`)

        return (!user)
    }
}