import got from 'got'

/**
 * @typedef {import('../services/CardService').Card} Card
 * @typedef {import('../services/CardService').CardPersistence} CardPersistence
 * @implements {CardPersistence}
 */
export default class CardPersistenceRestRepository {
    
    constructor(host) {
        this.host = host
    }

    /**
     * @param {Card} card 
     * 
     * @returns {Promise<Card>}
     */
    async addCard(card) {
        // @ts-ignore
        card.user_id = card.userId
        delete card.userId

        const response = await got.post(`${this.host}/api/cards`, {
            json: card
        })

        let result = JSON.parse(response.body)
        result.userId = result.user_id
        delete result.user_id
        
        return result
    }

    /**
     * @param {string} id 
     * 
     * @throws {Error} Not found
     * 
     * @returns {Promise<Card>}
     */
    async getCardById(id) {
        const response = await got.get(`${this.host}/api/cards/${id}`)

        return JSON.parse(response.body)
    }

    /**
     * @returns {Promise<Card[]>}
     */
    async all() {
        const response = await got.get(`${this.host}/api/cards`)

        return JSON.parse(response.body)
    }

    /**
     * @param {string} id 
     * @param {string} status 
     * 
     * @returns {Promise<Card>}
     */
    async updateStatus(id, status) {
        const response = await got.patch(`${this.host}/api/cards/${id}`, {
            json: {
                status: status
            }
        })

        return JSON.parse(response.body)
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Promise<Card[]>}
     */
    async search(criteria) {
        let url = `${this.host}/api/cards`
        
        if (criteria?.userId) {
            url = `${url}?userId=${criteria.userId}`
        }

        const response = await got.get(url)

        return JSON.parse(response.body)
    }
}