export default class CardPersistenceMock {
    constructor() {
        this.clean()
    }

    addCard(card) {
        if (this.error) {
            throw this.error
        }

        this.card = card
    }

    getCardById(id) {
        if (this.error) {
            throw this.error
        }

        return this.card
    }

    search(criteria) {
        if (this.error) {
            throw this.error
        }

        return this.card;
    } 

    clean() {
        this.card = null
        this.error = null
    }
}