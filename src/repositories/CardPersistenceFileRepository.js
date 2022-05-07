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
     */
    constructor(filePath) {
        /**@private */
        this.filePath = filePath

        /** @private */
        this.collection = this.loadCard()
    }

    /**
     * @param {Card} card 
     */
    addCard(card) {
        this.collection.push(card)

        this.save()
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
     * @returns {Card}
     */
    getCardById(id) {

        const idCard = lodash.findIndex(this.collection, {
            id
        })

        if (idCard >= 0) {
            return this.collection[idCard]
        }

        throw Error("Not found")
    }

    /**
     * @returns {Card[]}
     */
    all() {
        return this.collection
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {boolean}
     */
    exists(criteria) {
        const idx = lodash.findIndex(this.collection, criteria)

        return (idx >= 0)
    }

    /**
     * @param {string} id 
     * @param {string} status 
     */
    updateStatus(id, status) {
        const idx = lodash.findIndex(this.collection, { id: id })

        this.collection[idx].status = status
        this.collection[idx].updateAt = new Date()

        this.save()
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Card[]}
     */
    search(criteria) {
        return lodash.filter(this.collection, criteria)
    }
}