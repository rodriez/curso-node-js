import UserService from "../services/UserService.js";
import UserPersistenceFileRepository from "../repositories/UserPersistenceFileRepository.js";
const userPersitenceRepo = new UserPersistenceFileRepository('data/db.json')
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
}