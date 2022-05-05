import dotenv from 'dotenv'
import UserService from "../services/UserService.js";
import UserPersistenceFileRepository from "../repositories/UserPersistenceFileRepository.js";

dotenv.config()

const userPersitenceRepo = new UserPersistenceFileRepository(process.env.DB_USER)
const userService = new UserService(userPersitenceRepo);

export default class UserHandler {
    
    static addUser(request){
        try {
            userService.addUser(request)
        } catch (e) {
            console.log(e.message)
        }
    }

    static showUsers(){
        try {
            const users = userService.getUsers()
            console.clear()
            console.table(users)
        } catch (e) {
            console.log(e.message)
        }
    }

    static changeUser(req){
        try {
            userService.updateUser(req)
            UserHandler.showUsers()
        } catch (error) {
            console.log(error.message)
        }
    }
    
}