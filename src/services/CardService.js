import UserService from "../services/UserService.js";
import * as uuid from 'uuid'

export const STATUS_PENDING = "Pending"
export const STATUS_DONE="Done"
export const STATUS_IN_PROGRESS= "In Progress"
const validStatuses = [STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_DONE]

/** 
 * @typedef {object} CardPersistence
 * 
* @typedef {object} card
* @param {string=} title
* @param {string=} description
* @param {string=} userEmail
* @param {string=} status
*/
export default class CardService {

    /**
    * 
    * @param {CardPersistence} cardPersistence 
    */

    constructor(cardPersistence) {
       
        /**@private */
        this.cardPersistence = cardPersistence

    }

    /**
     * This function register a new card in the app
     * 
     * @param {object} req
     * @param {string=} req.title
     * @param {string=} req.description
     * @param {string=} req.userId
     * @param {string=} req.status
     * @throws {Error} Invalid title
     * @throws {Error} Invalid description
     * @throws {Error} Invalid userId
     * @throws {Error} Invalid status
     */
    addCard(req) {

        this.checkAddCardRequest(req)

        const card = {
            id: uuid.v4().split('-')[0],
            userId: req.userId,
            title: req.title,
            description: req.description,
            status: STATUS_PENDING,
            createAt: new Date(),
            updateAt: new Date()
        }

        this.cardPersistence.addCard(card)
        return card
    }

    /**@private */
    checkAddCardRequest(req) {
        if (req ?.title === "") {
            throw Error("Invalid title")
        }

        if (req ?.description === "") {
            throw Error("Invalid description")
        }

        if (req ?.userId === "") {

            throw Error("Invalid userId")
        }
    }

    getCardById(id){

        return this.cardPersistence.getCardById(id)
    }

    getCards(){
        const allCards = this.cardPersistence.getCards()
        for (const i of allCards) {
            delete(i.createAt)
            delete(i.updateAt)
        }
        return allCards
    }

    updateStatus(id, status) {
        this.checkUpdateStatusRequest(id, status)

        if (!this.cardPersistence.exists({id:id})) {
            throw Error("Card not found")
        }

        this.cardPersistence.updateStatus(id, status)
    }

    checkUpdateStatusRequest(id, status) {
        if (id === "") {
            throw Error("Invalid card id")
        }

        if (status === "" || !validStatuses.includes(status)) {
            throw Error("Invalid state")
        }
    }
}

