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
        const url = `${this.host}/api/users`
        const fn = async () => {
            const response = await got.post(url, {
                json: user
            })
    
            return JSON.parse(response.body)
        }
        
        return await this.execute(fn)
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getUsers() {
        const url = `${this.host}/api/users`
        const fn = async () => {
            const response = await got.get(url)
        
            return JSON.parse(response.body)
        }

        return await this.execute(fn)
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
        const url = `${this.host}/api/users/${id}`
        const fn = async() => {
            delete req.id

            const response = await got.patch(url, {
                json: req
            })

            return JSON.parse(response.body)
        }

        return await this.execute(fn)
    }

    /**
     * @param {string} id 
     * 
     * @returns {Promise<User>}
     */
    async getUserById(id) {
        const url = `${this.host}/api/users/${id}`
        const fn = async () => {
            const response = await got.get(url)
        
            return JSON.parse(response.body)
        }

        return await this.execute(fn)
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

    /**@private */
    async execute(fn) {
        try {
            return await fn()
        } catch(e) {
            const errorBody = JSON.parse(e.response.body)
            throw Error(errorBody.error)
        }
    }
}