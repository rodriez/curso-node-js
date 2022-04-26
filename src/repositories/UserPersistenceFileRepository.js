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
        
        const folder = path.dirname(this.filePath)
        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder)
        }

        fs.writeFileSync(this.filePath, JSON.stringify(this.collection))
    }

    /*getUserId(user) {
        return user.id
    }*/

    getUsers(){
        return this.collection
    }

    load() {
        if (fs.existsSync(this.filePath)) {
            const content = fs.readFileSync(this.filePath)
            return JSON.parse(content.toString())
        }

        return []
    }
}