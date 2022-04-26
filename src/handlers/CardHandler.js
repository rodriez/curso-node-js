import dotenv from 'dotenv'
import CardService from "../services/CardService.js";
import CardPersistenceFileRepository from "../repositories/CardPersistenceFileRepository.js";

dotenv.config()

const cardPersitenceRepo = new CardPersistenceFileRepository(process.env.DB_CARD)
const cardService = new CardService(cardPersitenceRepo);

export default class CardHandler {
    static addCard(req) {
        try {
            const newCard = cardService.addCard(req)
            CardHandler.showCard(newCard)

        } catch (e) {
            console.log(e.message)
        }
    }


    static showCard(req) {
    
        try {
            const card = cardService.getCardById(req.id)
            console.clear()
            console.log(card)

        } catch (e) {

            console.log(e.message)
        }
    }

}