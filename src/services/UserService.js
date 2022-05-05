import * as uuid from 'uuid'
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
 * @property {function(UserSearchCriteria):boolean} exists - This function validate if the user is already registered
 * @property {function(User):void} add - This function write a new user in the database
 */
export default class UserService {
    /**
     * 
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
     * @throws {Error} Invalid user name
     * @throws {Error} Invalid user email
     * @throws {Error} Invalid user pass
     */
    addUser(req) {
        this.checkAddUserRequest(req)

        const user = {
            id: uuid.v4(),
            name: req.name,
            email: req.email,
            pass: req.pass,
            createAt: new Date(),
            updateAt: new Date()
        }

        if (this.userPersistence.exists({ email: user.email })) {
            throw Error("The user is already registered")
        }

        this.userPersistence.add(user)
    }
    updateUser(req) {
        this.checkUpdateUserRequest(req)
        //req ? req.email : ''
        if (this.userPersistence.exists({ email: req?.email })) {
            throw Error("the email is already in use")
        }
        const validatedRequest = {
            id: req.id,
            name: req.name,
            email: req.email,
            pass: req.pass
        }
        this.userPersistence.update(validatedRequest)
    }

    /**@private */
    checkUpdateUserRequest(req){
        if (req?.id == undefined || req?.id.trim() == '') {
            throw Error('Invalid user Id')
        }
        if (req.name != undefined && req.name == '') {
            throw Error('Invalid user name')
        }
        if (req.email != undefined && req.email == '') {
            throw Error('Invalid user email')
        }
        if (req.pass != undefined && req.pass == '') {
            throw Error('Invalid user password')
        }
    }

    /**@private */
    checkAddUserRequest(req) {
        if (req?.name === "") {
            throw Error("Invalid user name")
        }

        if (req?.email === "") {
            throw Error("Invalid user email")
        }

        if (req?.pass === "") {
            throw Error("Invalid user password")
        }
    }

    getUsers(){
        const allUsers = this.userPersistence.getUsers()
        for (const i of allUsers) {
            delete(i.pass)
            delete(i.createAt)
            delete(i.updateAt)
        }
        return allUsers
    }

    getUserById(id) {
        return this.userPersistence.getUserById(id)
    }

}