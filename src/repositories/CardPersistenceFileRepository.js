import * as fs from 'fs'
import * as path from 'path'
import lodash from 'lodash'

/**
 * @typedef {import('../services/CardService').CardPersistence} CardPersistence
 * @implements {CardPersistence}
 */
export default class CardPeristenceFileRepository {

    /**
     * 
     * @param {string} filePath 
     */
    constructor(filePath) {
        this.filePath = filePath

        this.collection = this.loadCard()
    }

    /**
     * @param {*} card 
     */
    addCard(card) {
        this.collection.push(card)

        const folder = path.dirname(this.filePath)
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }

        fs.writeFileSync(this.filePath, JSON.stringify(this.collection))
    }

    loadCard() {
        if (fs.existsSync(this.filePath)) {
            const content = fs.readFileSync(this.filePath)
            return JSON.parse(content.toString())
        }

        return []
    }


    getCardById(id) {

        const idCard = lodash.findIndex(this.collection, {
            id
        })

        if (idCard >= 0) {
            return this.collection[idCard]
        }

        throw Error("Not found")
    }

}