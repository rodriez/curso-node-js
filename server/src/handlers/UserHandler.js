import UserService from "../services/UserService.js";
import UserPersistenceSqlRepository from '../repositories/UserPersistenceSqlRepository.js';
import crypto from "crypto"

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
            pass: crypto.createHash('md5').update(`mi-secreto-${req.body.pass}`).digest('hex') 
        }

        userService.addUser(addUserReq)
        .then((user) => {
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

}