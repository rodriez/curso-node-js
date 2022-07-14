import UserPersistenceRestRepository from '../repositories/UserPersistenceRestRepository.js';
import UserService from "../services/UserService.js";
import AuthRepository from '../repositories/AuthRepository.js';

const authRepository = new AuthRepository(`${process.env.HOST}`, `${process.env.CREDENTIALS_FILE}`)
const userPersitenceRepo = new UserPersistenceRestRepository(`${process.env.HOST}`, authRepository);
const userService = new UserService(userPersitenceRepo);

export default class UserHandler {
    
    /**
     * @param {*} request 
     */
    static async addUser(request){
        try {
            await userService.addUser(request)

            await UserHandler.showUsers()
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
            
            await UserHandler.showUsers()
        } catch (error) {
            console.log(error.message)
        }
    }
}