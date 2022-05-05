import * as fs from 'fs'
import * as path from 'path'
import lodash from 'lodash'

/**
 * @typedef {import('../services/UserService').UserPersistence} UserPersistence
 * @implements {UserPersistence}
 */
export default class UserPeristenceFileRepository {

    /**
     * 
     * @param {string} filePath 
     */
    constructor(filePath) {
        this.filePath = filePath

        this.collection = this.load()
    }

    /**
     * @param {*} criteria 
     * @returns {boolean}
     */
    exists(criteria) {
        const index = lodash.findIndex(this.collection, criteria)

        return (index >= 0)
    }

    /**
     * @param {*} user 
     */
    add(user) {
        this.collection.push(user)

        this.save()
    }

    getUsers() {
        return this.collection
    }

    load() {
        if (fs.existsSync(this.filePath)) {
            const content = fs.readFileSync(this.filePath)
            return JSON.parse(content.toString())
        }

        return []
    }
    update(req) {
        const idx = lodash.findIndex(this.collection, { id: req.id })
        if (idx < 0) {
            throw Error('User not found')
        }
        this.collection[idx].name = req.name ? req.name : this.collection[idx].name
        this.collection[idx].email = req.email ? req.email : this.collection[idx].email
        this.collection[idx].pass = req.pass ? req.pass : this.collection[idx].pass

        this.save()
    }

    save() {
        const folder = path.dirname(this.filePath)
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }

        fs.writeFileSync(this.filePath, JSON.stringify(this.collection))
    }

    getUserById(id) {
        const idx = lodash.findIndex(this.collection, { id: id })

        return this.collection[idx]
    }
}