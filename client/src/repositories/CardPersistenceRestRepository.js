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
        const url = `${this.host}/api/cards`
        const fn = async() => {
            const response = await got.post(url, {
                json: {
                    title: card.title,
                    description: card.description,
                    user_id: card.user.id
                }
            })
    
            return JSON.parse(response.body)
        }

        const result = await this.execute(fn)
        return this.buildCard(result)
    }

    /**
     * @param {string} id 
     * 
     * @throws {Error} Not found
     * 
     * @returns {Promise<Card>}
     */
    async getCardById(id) {
        const url = `${this.host}/api/cards/${id}`
        const fn = async() => {
            const response = await got.get(url)
            return JSON.parse(response.body)
        }

        const result = await this.execute(fn)
        return this.buildCard(result)
    }

    /**
     * @returns {Promise<Card[]>}
     */
    async all() {
        const url = `${this.host}/api/cards`
        const fn = async() => {
            const response = await got.get(url)

            return JSON.parse(response.body)
        }
        
        return await this.execute(fn)
    }

    /**
     * @param {string} id 
     * @param {string} status 
     * 
     * @returns {Promise<Card>}
     */
    async updateStatus(id, status) {
        const url = `${this.host}/api/cards/${id}`
        const fn  = async() => {
            const response = await got.patch(url, {
                json: {
                    status: status
                }
            })
    
            return JSON.parse(response.body)
        }
        
        const result = await this.execute(fn)
        return this.buildCard(result)
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Promise<Card[]>}
     */
    async search(criteria) {
        let url = `${this.host}/api/cards`
        const fn = async() => {
            if (criteria?.user?.id) {
                url = `${url}?userId=${criteria?.user?.id}`
            }
    
            const response = await got.get(url)
    
            return JSON.parse(response.body)
        }

        return await this.execute(fn)
    }

    /** @private */
    buildCard(apiResponse) {
        return {
            id: apiResponse.id,
            userId: apiResponse.user.id,
            title: apiResponse.title,
            description: apiResponse.description,
            status: apiResponse.status,
            user: apiResponse.user,
            createAt: apiResponse.createAt,
            updateAt: apiResponse.updateAt
        }
    }

    /**@private */
    async execute(fn) {
        try {
            return await fn()
        } catch(e) {
            const errorBody = JSON.parse(e.response.body)
            throw Error(errorBody.error)
        }
    }
}