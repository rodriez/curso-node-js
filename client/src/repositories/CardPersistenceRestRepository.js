import got from 'got'

/**
 * @typedef {import('../services/CardService').Card} Card
 * @typedef {import('../services/CardService').CardPersistence} CardPersistence
 * @typedef {import('../services/AuthService').AuthRepository} AuthRepository
 * 
 * @implements {CardPersistence}
 */
export default class CardPersistenceRestRepository {
    
    /**
     * 
     * @param {string} host 
     * @param {AuthRepository} authRepository
     * @param {import('events').EventEmitter=} eventEmitter 
     */
    constructor(host, authRepository, eventEmitter) {
        this.host = host
        this.authRepository = authRepository
        this.eventEmitter = eventEmitter
    }

    /**
     * @param {Card} card 
     * 
     * @returns {Promise<Card>}
     */
    async addCard(card) {
        const creds = this.authRepository.readCredentials()
        const url = `${this.host}/api/cards`
        const fn = async() => {
            const response = await got.post(url, {
                json: {
                    title: card.title,
                    description: card.description,
                    user_id: card.user.id
                },
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })
    
            return JSON.parse(response.body)
        }

        const result = await this.execute(fn)
        const response = this.buildCard(result)
        // @ts-ignore
        this.eventEmitter.emit("card-created", response)

        return response
    }

    /**
     * @param {string} id 
     * 
     * @throws {Error} Not found
     * 
     * @returns {Promise<Card>}
     */
    async getCardById(id) {
        const creds = this.authRepository.readCredentials()
        const url = `${this.host}/api/cards/${id}`
        const fn = async() => {
            const response = await got.get(url, {
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })
            return JSON.parse(response.body)
        }

        const result = await this.execute(fn)
        return this.buildCard(result)
    }

    /**
     * @returns {Promise<Card[]>}
     */
    async all() {
        const creds = this.authRepository.readCredentials()
        const url = `${this.host}/api/cards`
        const fn = async() => {
            const response = await got.get(url, {
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })

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
        const creds = this.authRepository.readCredentials()
        const url = `${this.host}/api/cards/${id}`
        const fn  = async() => {
            const response = await got.patch(url, {
                json: {
                    status: status
                },
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })
    
            return JSON.parse(response.body)
        }
        
        const result = await this.execute(fn)
        const response = this.buildCard(result)

        // @ts-ignore
        this.eventEmitter.emit("card-updated", response)

        return response
    }

    /**
     * @param {Card} criteria 
     * 
     * @returns {Promise<Card[]>}
     */
    async search(criteria) {
        const creds = this.authRepository.readCredentials()
        let url = `${this.host}/api/cards`
        const fn = async() => {
            if (criteria?.user?.id) {
                url = `${url}?userId=${criteria?.user?.id}`
            }
    
            const response = await got.get(url, {
                headers: {
                    authorization: `Bearer ${creds.token}`
                }
            })
    
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