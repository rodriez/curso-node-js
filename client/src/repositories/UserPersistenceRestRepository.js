import got from 'got'

/**
 * @typedef {import('../services/UserService').User} User
 * @typedef {import('../services/UserService').UserPersistence} UserPersistence
 * 
 * @implements {UserPersistence}
 */
export default class UserPersistenceRestRepository {
    /**
     * @param {User} criteria 
     * 
     * @returns {Promise<boolean>}
     */
     async exists(criteria) {
        
    }

    /**
     * @param {User} user 
     */
    async add(user) {
        
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getUsers() {
        const response = await got.get("http://localhost:3000/api/users")
        
        return JSON.parse(response.body)
    }

    /**
     * @param {User} req
     * 
     * @throws {Error} User not found 
     */
    async update(req) {
        
    }

    /**
     * @param {string} id 
     * 
     * @returns {Promise<User>}
     */
    async getUserById(id) {

    }
}