import * as uuid from 'uuid'

export const STATUS_PENDING = "Pending"
export const STATUS_DONE = "Done"
export const STATUS_IN_PROGRESS = "In Progress"

const validStatuses = [STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_DONE]

/** 
 * @typedef {import('./UserService').User} User
 * 
 * @typedef {object} UserPersistence
 * @property {function(string):User} getUserById - Search and return the user that match with the given id
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
 * @property {function():Promise<Card[]>} all - Return all registered cards
 * @property {function(Card):Promise<boolean>} exists - Return a value if that indicate if the Card is already registered
 * @property {function(string, string):Promise} updateStatus - Update an existing Card
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
            id: uuid.v4().split('-')[0],
            userId: req.userId,
            title: req.title,
            description: req.description,
            status: STATUS_PENDING,
            createAt: new Date(),
            updateAt: new Date()
        }

        await this.cardPersistence.addCard(card)

        return card
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
        const card = await this.cardPersistence.getCardById(id)
        const user = await this.userService.getUserById(`${card.userId}`)

        //NOTE: La funcion delete tiene un Syntatic Sugar para evitar escribir los parentesis 
        delete card.userId
        delete user.pass
        delete user.createAt
        delete user.updateAt

        card.user = user

        return card
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

        if (!(await this.cardPersistence.exists({ id: id }))) {
            throw Error("Card not found")
        }

        this.cardPersistence.updateStatus(id, status)
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

