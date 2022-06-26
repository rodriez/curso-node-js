import UserModel from '../model/UserModel.js'

/**
 * @typedef {import('../services/UserService').User} User
 * @typedef {import('../services/UserService').UserPersistence} UserPersistence
 * @typedef {import('../services/DashboardService').DashboardUserPersistence} DashboardUserPersistence
 * 
 * @implements {UserPersistence}
 * @implements {DashboardUserPersistence}
 */
export default class UserPersistenceSqlRepository {

    /**
     * @param {User} criteria 
     * 
     * @returns {Promise<boolean>}
     */
    async exists(criteria) {
        const amount = await UserModel.count({
            where: criteria
        })

        return amount > 0
    }

    /**
     * @param {User} user 
     */
    async add(user) {
        await UserModel.create(user)
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getUsers() {
        const resultSet = await UserModel.findAll()

        return resultSet.map(u => u.toUser())
    }

    /**
     * @param {User} req
     * 
     * @throws {Error} User not found 
     */
    async update(req) {
        const userId = req.id
        delete req.id

        await UserModel.update(req, {
            where: {
                id: userId
            }
        })
    }

    /**
     * @param {string} id 
     * 
     * @returns {Promise<User|undefined>}
     */
    async getUserById(id) {
        const row = await UserModel.findByPk(id)

        return row?.toUser()
    }

}