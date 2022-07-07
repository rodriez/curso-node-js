import NotFound from '../errors/NotFound.js';
import CardModel from '../model/CardModel.js';

/**
 * @typedef {import('../services/CardService').Card} Card
 * @typedef {import('../services/CardService').CardPersistence} CardPersistence
 * @implements {CardPersistence}
 */
export default class CardPersistenceSqlRepository {

    /**
     * 
     * @param {Card} card 
     */
    async addCard(card) {
        const row = CardModel.fromCard(card)
        
        await CardModel.create(row)
    }

    /**
     * @param {string} id 
     * 
     * @throws {Error} Not found
     * 
     * @returns {Promise<Card>}
     */
    async getCardById(id) {
        const row = await CardModel.findByPk(id)

        if (row) {
            return row.toCard()
        }

        throw new NotFound("Not found")
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Promise<boolean>}
     */
    async exists(criteria) {
        const amount = await CardModel.count({
            where: CardModel.fromCard(criteria)
        })

        return amount > 0
    }

    /**
     * @param {string} id 
     * @param {string} status 
     */
    async updateStatus(id, status) {
        await CardModel.update({status: status}, {
            where : {
                id: id
            }
        })

        await CardModel.findByPk(id)
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Promise<Card[]>}
     */
     async search(criteria) {
        const resultSet = await CardModel.findAll({
            where: CardModel.fromCard(criteria)
        })

        return resultSet.map(r => r.toCard())
    }

    /**
     * @param {string} id 
     */
    async delete(id) {
        await CardModel.destroy({
            where: {
                id:id
            }
        })
    }
}