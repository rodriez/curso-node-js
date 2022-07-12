import Unauthorized from '../errors/Unauthorized.js';
import JsonWebTokenRepository from '../repositories/JsonWebTokenRepository.js';
import UserPersistenceSqlRepository from '../repositories/UserPersistenceSqlRepository.js';
import AuthorizationService from '../services/AuthorizationService.js';

const userPersistence = new UserPersistenceSqlRepository()
const tokenRepository = new JsonWebTokenRepository(`${process.env.JWT_SECRET}`, `${process.env.JWT_ALGORITHM}`, `${process.env.JWT_DURATION}`)
const authService = new AuthorizationService(userPersistence, tokenRepository)

export default class AuthorizationHandler {

    static checkAuth(req, res, next) {
        try {
            if (!req?.headers?.authorization) {
                throw new Unauthorized("Invalid token")
            }

            const [authType, authHash] = `${req.headers.authorization}`.trim().split(" ")
            switch (authType) {
                case 'Bearer': 
                    authService.validateToken(authHash)
                    return next()
                case "Basic":
                    if (req.path == '/api/login') {
                        req.basicCredentials = authService.parseCredentials(authHash)
                        return next()
                    }
                default: throw new Unauthorized("Invalid token")
            }

        } catch(e) {
            next(e)
        }
    }

    static login(req, res, next) {
        authService.login(req.basicCredentials)
            .then(token => res.status(200).json({token}))
            .catch(next)
    }

}