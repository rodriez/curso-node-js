import * as fs from 'fs'
import * as path from 'path'
import lodash from 'lodash'

/**
 * @typedef {import('../services/CardService').Card} Card
 * @typedef {import('../services/CardService').CardPersistence} CardPersistence
 * @implements {CardPersistence}
 */
export default class CardPeristenceFileRepository {

    /**
     * @param {string} filePath 
     * @param {import('events').EventEmitter=} eventEmitter 
     */
    constructor(filePath, eventEmitter) {
        /**@private */
        this.filePath = filePath

        /** @private */
        this.collection = this.loadCard()
        /** @private */
        this.eventEmitter = eventEmitter
    }

    /**
     * @param {Card} card 
     */
    async addCard(card) {
        this.collection.push(card)

        this.save()

        // @ts-ignore
        this.eventEmitter.emit("card-created", card)
    }

    /**@private */
    save() {
        const folder = path.dirname(this.filePath)
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }

        fs.writeFileSync(this.filePath, JSON.stringify(this.collection))
    }

    /**
     * @private
     * 
     * @returns {Card[]}
     */
    loadCard() {
        if (fs.existsSync(this.filePath)) {
            const content = fs.readFileSync(this.filePath)
            return JSON.parse(content.toString())
        }

        return []
    }


    /**
     * @param {string} id 
     * 
     * @throws {Error} Not found
     * 
     * @returns {Promise<Card>}
     */
     async getCardById(id) {

        const idCard = lodash.findIndex(this.collection, {
            id
        })

        if (idCard >= 0) {
            return this.collection[idCard]
        }

        throw Error("Not found")
    }

    /**
     * @returns {Promise<Card[]>}
     */
    async all() {
        return this.collection
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Promise<boolean>}
     */
    async exists(criteria) {
        const idx = lodash.findIndex(this.collection, criteria)

        return (idx >= 0)
    }

    /**
     * @param {string} id 
     * @param {string} status 
     */
    async updateStatus(id, status) {
        const idx = lodash.findIndex(this.collection, { id: id })

        this.collection[idx].status = status
        this.collection[idx].updateAt = new Date()

        this.save()
        // @ts-ignore
        this.eventEmitter.emit("card-updated", this.collection[idx])
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Promise<Card[]>}
     */
    async search(criteria) {
        return lodash.filter(this.collection, criteria)
    }
}