import * as uuid from 'uuid'

export const STATUS_PENDING = "Pending"
export const STATUS_DONE = "Done"
export const STATUS_IN_PROGRESS = "In Progress"

const validStatuses = [STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_DONE]

/** 
 * @typedef {import('./UserService').User} User
 * @typedef {import('./UserService').UserPersistence} UserPersistence
 * 
 * @typedef {object} Card
 * @property {string=} id
 * @property {string=} title
 * @property {string=} description
 * @property {string=} status
 * @property {User} user
 * @property {Date=} createAt
 * @property {Date=} updateAt
 * 
 * @typedef {object} CardPersistence
 * @property {function(Card):Promise<Card>} addCard - Create an new card
 * @property {function(string):Promise<Card>} getCardById - Search & return the card of the given id
 * @property {function():Promise<Card[]>} all - Return all registered cards
 * @property {function(string, string):Promise<Card>} updateStatus - Update an existing Card
 *
*/
export default class CardService {
    
    /**
    * @param {CardPersistence} cardPersistence 
    * @param {UserPersistence} userService 
    */
    constructor(cardPersistence, userService) {
        /**@private */
        this.cardPersistence = cardPersistence

        /**@private */
        this.userService = userService
    }

    /**
     * This function register a new card in the app
     * 
     * @param {object} req
     * @param {string=} req.title
     * @param {string=} req.description
     * @param {string=} req.userId
     * @param {string=} req.status
     * 
     * @throws {Error} Invalid title
     * @throws {Error} Invalid description
     * @throws {Error} Invalid userId
     * @throws {Error} Invalid status
     * 
     * @returns {Promise<Card>}
     */
    async addCard(req) {

        this.checkAddCardRequest(req)

        const card = {
            user: {
                id: req.userId
            },
            title: req.title,
            description: req.description
        }

        return await this.cardPersistence.addCard(card)
    }

    /**@private */
    checkAddCardRequest(req) {
        if (req?.title === "") {
            throw Error("Invalid title")
        }

        if (req?.description === "") {
            throw Error("Invalid description")
        }

        if (req?.userId === "") {

            throw Error("Invalid userId")
        }
    }

    /**
     * Search and return the card 
     * 
     * @param {string} id 
     * 
     * @returns {Promise<Card>}
     */
    async getCardById(id) {
        return await this.cardPersistence.getCardById(id)
    }

    /**
     * Return all registered cards
     * Creation and last update date are not included in the result
     * 
     * @returns {Promise<Card[]>}
     */
    async getCards() {
        const allCards = await this.cardPersistence.all()

        for (const i of allCards) {
            delete i.createAt
            delete i.updateAt
        }

        return allCards
    }

    /**
     * Update the card status
     * If there is no card with that id, throws an error
     * 
     * @param {string} id 
     * @param {string} status
     * 
     * @throws {Error} Card not found
     */
    async updateStatus(id, status) {
        this.checkUpdateStatusRequest(id, status)

        await this.cardPersistence.updateStatus(id, status)
    }

    /**@private */
    checkUpdateStatusRequest(id, status) {
        if (id === "") {
            throw Error("Invalid card id")
        }

        if (status === "" || !validStatuses.includes(status)) {
            throw Error("Invalid state")
        }
    }
}

