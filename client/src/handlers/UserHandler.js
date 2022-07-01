import dotenv from 'dotenv'
import UserService from "../services/UserService.js";
import UserPersistenceSqlRepository from '../repositories/UserPersistenceSqlRepository.js';

dotenv.config()

//const userPersitenceRepo = new UserPersistenceFileRepository(`${process.env.DB_USER}`)
const userPersitenceRepo = new UserPersistenceSqlRepository();
const userService = new UserService(userPersitenceRepo);

export default class UserHandler {
    
    /**
     * @param {*} request 
     */
    static async addUser(request){
        try {
            await userService.addUser(request)
        } catch (e) {
            console.log(e.message)
        }
    }

    static async showUsers(){
        try {
            const users = await userService.getUsers()

            console.clear()
            console.table(users)
        } catch (e) {
            console.log(e.message)
        }
    }

    /**
     * @param {*} req 
     */
    static async changeUser(req){
        try {
            await userService.updateUser(req)
            
            UserHandler.showUsers()
        } catch (error) {
            console.log(error.message)
        }
    }
}