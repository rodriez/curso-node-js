import * as uuid from 'uuid'
import BadRequest from '../errors/BadRequest.js'
import NotFound from '../errors/NotFound.js'

/**
 * @typedef {object} UserSearchCriteria
 * @property {string=} id
 * @property {string=} email
 * 
 * @typedef {object} User
 * @property {string=} id
 * @property {string=} name
 * @property {string=} email
 * @property {string=} pass
 * @property {Date=} createAt
 * @property {Date=} updateAt
 * 
 * @typedef {object} UserPersistence
 * @property {function(UserSearchCriteria):Promise<boolean>} exists - This function validate if the user is already registered
 * @property {function(User):Promise} add - This function write a new user in the database
 * @property {function(User):Promise} update - This function update an existing user
 * @property {function(string):Promise} deleteUser - This function delete an existing user
 * @property {function():Promise<User[]>} getUsers - This function return all registered users
 * @property {function(string):Promise<User|undefined>} getUserById - This function search and return that match with the given id
 * @property {function(UserSearchCriteria):Promise<User|undefined>} find - This function search and return that match with the given criteria
 */
export default class UserService {
    
    /**
     * @param {UserPersistence} userPersistence 
     */
    constructor(userPersistence) {
        /**@private */
        this.userPersistence = userPersistence
    }

    /**
     * This function register a new user in the app
     * 
     * @param {object} req
     * @param {string=} req.name
     * @param {string=} req.email
     * @param {string=} req.pass 
     * 
     * @throws {Error} Invalid user name
     * @throws {Error} Invalid user email
     * @throws {Error} Invalid user pass
     * @throws {Error} The user is already registered
     */
    async addUser(req) {
        this.checkAddUserRequest(req)

        const user = {
            id: uuid.v4(),
            name: req.name,
            email: req.email,
            pass: req.pass,
            createAt: new Date(),
            updateAt: new Date()
        }

        if (await this.userPersistence.exists({ email: user.email })) {
            throw new BadRequest("The user is already registered")
        }

        await this.userPersistence.add(user)

        return user
    }

    /**
     * This function update the user info
     * If the email sended is already in use for another user throws an error
     * 
     * @param {object} req
     * @param {string} req.id
     * @param {string=} req.name
     * @param {string=} req.email
     * @param {string=} req.pass
     * 
     * @throws {Error} Invalid user Id
     * @throws {Error} Invalid user name
     * @throws {Error} Invalid user email
     * @throws {Error} Invalid user pass
     * @throws {Error} the email is already in use
     * 
     * @returns {Promise<User|undefined>} 
     */
    async updateUser(req) {
        this.checkUpdateUserRequest(req)
        
        //req ? req.email : ''
        if (req?.email && await this.userPersistence.exists({ email: req.email })) {
            throw new BadRequest("the email is already in use")
        }

        const validatedRequest = {
            id: req.id,
            name: req.name,
            email: req.email,
            pass: req.pass
        }

        await this.userPersistence.update(validatedRequest)

        return await this.userPersistence.getUserById(req.id)
    }

    /**@private */
    checkUpdateUserRequest(req){
        if (req?.id == undefined || req?.id.trim() == '') {
            throw new BadRequest('Invalid user Id')
        }
        
        if (req.name != undefined && req.name == '') {
            throw new BadRequest('Invalid user name')
        }
        
        if (req.email != undefined && req.email == '') {
            throw new BadRequest('Invalid user email')
        }

        if (req.pass != undefined && req.pass == '') {
            throw new BadRequest('Invalid user password')
        }
    }

    /**@private */
    checkAddUserRequest(req) {
        if (req?.name === "") {
            throw new BadRequest("Invalid user name")
        }

        if (req?.email === "") {
            throw new BadRequest("Invalid user email")
        }

        if (req?.pass === "") {
            throw new BadRequest("Invalid user password")
        }
    }

    /**
     * Return all registered users
     * Password, creation date & last update date are not included in the result
     * 
     * @returns {Promise<User[]>}
     */
    async getUsers(){
        return await this.userPersistence.getUsers()
    }

    /**
     * Return the user that match with the given id
     * If the id does not exists return undefined
     * 
     * @param {string} id 
     * 
     * @returns {Promise<User|undefined>}
     */
    async getUserById(id) {
        return await this.userPersistence.getUserById(id)
    }

    async deleteUser(req) {
        if(!req?.id) {
            throw new BadRequest("Invalid user id")
        }

        const user = await this.getUserById(req.id)

        if (!user) {
            throw new NotFound("User not found")
        }

        await this.userPersistence.deleteUser(req.id)

        return user
    }
}