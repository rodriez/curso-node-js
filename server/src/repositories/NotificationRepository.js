import EventEmmiter from 'events'
import notifier from 'node-notifier'

export default class NotificationRepository extends EventEmmiter {

    constructor() {
        super()

        this.on('card-created', this.onCardCreated)
        this.on('card-updated', this.onCardUpdated)
    }

    /**@private */
    onCardCreated(card) {
        notifier.notify(`The card ${card.id} has been added in ${card.status} column`)
    }

    onCardUpdated(card) {
        notifier.notify(`A card has been moved to ${card.status} column`)
    }
}