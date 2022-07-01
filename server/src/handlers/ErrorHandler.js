export default class ErrorHandler {

    /**
     * @param {Error} err 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static handle(err, req, res, next) {
        res.status(400).json({error: err.message})
    }

}