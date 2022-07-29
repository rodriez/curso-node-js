import * as uuid from 'uuid'
import BadRequest from '../errors/BadRequest.js'
import InternalError from '../errors/InternalError.js'
import NotFound from '../errors/NotFound.js'
import logger from '../logger.js'

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
 * @property {string=} userId
 * @property {string=} title
 * @property {string=} description
 * @property {string=} status
 * @property {User=} user
 * @property {Date=} createAt
 * @property {Date=} updateAt
 * 
 * @typedef {object} CardPersistence
 * @property {function(Card):Promise} addCard - Create an new card
 * @property {function(string):Promise<Card>} getCardById - Search & return the card of the given id
 * @property {function(Card):Promise<Card[]>} search - Return all registered cards
 * @property {function(Card):Promise<boolean>} exists - Return a value if that indicate if the Card is already registered
 * @property {function(string, string):Promise} updateStatus - Update an existing Card
 * @property {function(string):Promise} delete - Delete an existing Card
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
        logger.info(`/server/src/services/CardService.addCard - REQUEST - ${req.title}`)
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

        logger.debug(`addCard - CARD - ${JSON.stringify(card)}`)

        await this.doAddCard(card)

        return await this.getCardById(card.id)
    }

    /** @private */
    async doAddCard(card) {
        try {
            await this.cardPersistence.addCard(card)
        } catch (e) {
            logger.error(`Error adding card ${e.message}`)

            throw new InternalError("Oops something were wrong!!!")
        }
    }

    checkAddCardRequest(req) {
        if (!req.title || req?.title === "") {
            logger.error("BAD_REQUEST - Empty title")
            
            throw new BadRequest("Invalid title")
        }

        if (!req.description || req?.description === "") {
            logger.error("BAD_REQUEST - Empty description")

            throw new BadRequest("Invalid description")
        }

        if (!req.userId || req?.userId === "") {
            logger.error("BAD_REQUEST - Empty userId")

            throw new BadRequest("Invalid userId")
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
        if (!id) {
            throw new BadRequest("Invalid id")
        }

        const card = await this.cardPersistence.getCardById(id)
        const user = await this.getUserById(card.userId)

        return {
            id: card.id,
            title: card.title,
            description: card.description,
            user: {
                id: user?.id,
                name: user?.name,
                email: user?.email
            },
            createAt: card.createAt,
            updateAt: card.updateAt
        }
    }

    /** @private */
    async getUserById(userId) {
        try {
            return await this.userService.getUserById(`${userId}`)
        } catch (e) {
            logger.error(`Error getting user ${e.message}`)
            throw new InternalError("Oops something were wrong!!!")
        }
    }

    /**
     * Return all registered cards
     * Creation and last update date are not included in the result
     * 
     * @param {Card} criteria
     * 
     * @returns {Promise<Card[]>}
     */
    async getCards(criteria) {
        this.checkGetCardsCriteria(criteria)

        try {
            return await this.cardPersistence.search(criteria)
        } catch (e) {
            logger.error(`Error trying to search cards ${e.message}`)
            throw new InternalError("Oops something were wrong!!!")
        }
    }

    /**@private */
    checkGetCardsCriteria(criteria) {
        if (criteria.id != undefined && !criteria.id) {
            throw new BadRequest("Invalid id")
        }
    }

    /**
     * Update the card status
     * If there is no card with that id, throws an error
     * 
     * @param {string} id 
     * @param {string} status
     * 
     * @throws {Error} Card not found
     * 
     * @returns {Promise<Card>}
     */
    async updateStatus(id, status) {
        this.checkUpdateStatusRequest(id, status)

        if (!(await this.cardPersistence.exists({ id: id }))) {
            throw new NotFound("Card not found")
        }

        await this.cardPersistence.updateStatus(id, status)

        return await this.getCardById(id)
    }

    /**@private */
    checkUpdateStatusRequest(id, status) {
        if (id === "") {
            throw new BadRequest("Invalid card id")
        }

        if (status === "" || !validStatuses.includes(status)) {
            throw new BadRequest("Invalid state")
        }
    }

    async deleteCard(id) {
        if (id === "") {
            throw new BadRequest("Invalid card id")
        }

        const card = await this.getCardById(id)

        if (!card) {
            throw new NotFound("Card not found")
        }

        await this.cardPersistence.delete(id)

        return card
    }
}

