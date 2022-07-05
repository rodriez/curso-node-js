import UserService from "../services/UserService.js";
import UserPersistenceSqlRepository from '../repositories/UserPersistenceSqlRepository.js';

const userPersitenceRepo = new UserPersistenceSqlRepository();
const userService = new UserService(userPersitenceRepo);

export default class UserHandler {

    /**
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static addUser(req, res, next) {
        const addUserReq = {
            name: req.body.name,
            email: req.body.email,
            pass: req.body.pass 
        }

        userService.addUser(addUserReq)
        .then((user) => {
            // @ts-ignore
            delete user.pass

            res.status(201).json(user)
        })
        .catch(next)
    }

    static getUser(req, res, next) {
        userService.getUserById(req.params.id)
            .then((user) => {
                delete user?.pass

                res.status(200).json(user)
            })
            .catch(next)
    }

    static updateUser(req, res, next) {
        const updateUserRequest = {
            id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            pass: req.body.pass
        }

        userService.updateUser(updateUserRequest)
            .then((user) => {
                delete user?.pass

                res.status(200).json(user)
            })
            .catch(next)
    }

    static showUsers(req, res, next) {
        userService.getUsers()
            .then((users) => {
                const presentableUsers = users.map(u => {
                    delete u.pass
                    return u
                })

                res.status(200).json(presentableUsers)
            })
            .catch(next)
    }

    static deleteUser(req, res, next) {
        const deleteUserRequest = {
            id: req.params.id
        }

        userService.deleteUser(deleteUserRequest)
            .then(user => {
               res.status(200).json(user) 
            })
            .catch(next)
    }
}