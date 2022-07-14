import got from 'got'

/**
 * @typedef {import('../services/UserService').User} User
 * @typedef {import('../services/UserService').UserPersistence} UserPersistence
 * @typedef {import('../services/AuthService').AuthRepository} AuthRepository
 * 
 * @implements {UserPersistence}
 */
export default class UserPersistenceRestRepository {

    /**
     * 
     * @param {string} host 
     * @param {AuthRepository} authRepository 
     */
    constructor(host, authRepository) {
        this.host = host
        this.authRepository = authRepository
    }

    /**
     * @param {User} user 
     */
    async add(user) {
        const creds = this.authRepository.readCredentials()
        const url = `${this.host}/api/users`
        const fn = async () => {
            const response = await got.post(url, {
                json: user,
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })
    
            return JSON.parse(response.body)
        }
        
        return await this.execute(fn)
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getUsers() {
        const creds = this.authRepository.readCredentials()
        const url = `${this.host}/api/users`
        const fn = async () => {
            const response = await got.get(url, {
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })
        
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
        const creds = this.authRepository.readCredentials()
        const id = req.id
        const url = `${this.host}/api/users/${id}`
        const fn = async() => {
            delete req.id

            const response = await got.patch(url, {
                json: req,
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
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
        const creds = this.authRepository.readCredentials()
        const url = `${this.host}/api/users/${id}`
        const fn = async () => {
            const response = await got.get(url, {
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })
        
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