import Forbbiden from '../errors/Forbidden.js';

export default class AuthorizationHandler {

    static checkAuth(req, res, next) {
        if (req.headers.authorization != undefined || `${req.headers.authorization}`.indexOf("Basic") >= 0) {
            const hash = `${req.headers.authorization}`.replace("Basic ", "")
            const credentials = Buffer.from(hash, 'base64').toString().split(":")
    
            if (credentials[0] === "root" && credentials[1] === "12345") {
                return next()
            }
        }
    
        next(new Forbbiden("You are not authorized to access this information"))
    }

}