import CardPersistenceSqlRepository from "../repositories/CardPersistenceSqlRepository.js"
import CardService from "../services/CardService.js"
import UserPersistenceSqlRepository from "../repositories/UserPersistenceSqlRepository.js";

const userPeristenceRepo = new UserPersistenceSqlRepository()
const cardPersistenceRepo = new CardPersistenceSqlRepository()
const cardService = new CardService(cardPersistenceRepo, userPeristenceRepo)


export default class CardHandler {

    static addCard(req, res, next) {
        const addCardRequest = {
            title: req.body.title,
            description: req.body.description,
            userId: req.body.user_id
        }

        cardService.addCard(addCardRequest)
            .then(card => {
                res.status(201).json(card)
            })
            .catch(next)
    }

    static showCard(req, res, next) {
        cardService.getCardById(req.params.id)
            .then(card => {
                res.status(200).json(card)
            })
            .catch(next)
    }

}