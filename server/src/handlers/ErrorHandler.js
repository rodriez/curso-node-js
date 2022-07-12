export default class ErrorHandler {

    /**
     * @param {Error} err 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static handle(err, req, res, next) {
        switch (err.name) {
            case 'BadRequest':
                res.status(400).json({error: err.message})
                break;
            case 'NotFound':
                res.status(404).json({error: err.message})
                break;
            case 'Forbidden':
                res.status(403).json({error: err.message})
                break;
            case 'Unauthorized':
                res.status(401).json({error: err.message})
                break;
            default:
                res.status(500).json({error: err.message})
                break;
        }
    }

}