import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_DONE } from "../services/CardService.js"

/**
 * @typedef {import('./CardService').Card} Card
 * 
 * @typedef {object} DashboardCardPersistence
 * @property {function(Card):Promise<Card[]>} search - This function return all the cards that match with the given criteria 
 * @property {function():Promise<Card[]>} all - This function return all registered cards
 * 
 * @typedef {import('./UserService').User} User
 * 
 * @typedef {object} DashboardUserPersistence
 * @property {function(User):Promise<boolean>} exists - This function return all the cards that match with the given criteria
 * 
 * @typedef {object} Dashboard
 * @property {Card[]} pending
 * @property {Card[]} inProgress
 * @property {Card[]} done
 * 
 * @typedef {object} ShowDashboardRequest
 * @property {string=} userId 
 * 
 * @typedef {object} DashboardPresenter
 * @property {function(Dashboard):void} present - This function show the dashboard
 */
export default class DashboardService {

    /**
     * @param {DashboardCardPersistence} cardPersistence 
     * @param {DashboardPresenter} dashboardPresenter 
     * @param {DashboardUserPersistence} userPersistence 
     */
    constructor(cardPersistence, dashboardPresenter, userPersistence) {
        this.cardPersistence = cardPersistence
        this.dashboardPresenter = dashboardPresenter
        this.userPersistence = userPersistence
    }

    /**
     * This function show the dashboard in a screen
     * 
     * @param {ShowDashboardRequest=} req
     * 
     * @throws {Error} Invalid userId
     */
    async showDashboard(req) {
        let cards = []
        if (req?.userId && !(await this.userPersistence.exists({id: req.userId}))) {
            throw Error("Invalid userId")
        } else if (req?.userId) {
            const criteria = {
                user: {
                    id: req.userId
                }
            }
            
            cards = await this.cardPersistence.search(criteria)
        } else {
            cards = await this.cardPersistence.all()
        }

        const dashboard = {
            pending: cards.filter((c) => c.status === STATUS_PENDING),
            inProgress: cards.filter((c) => c.status === STATUS_IN_PROGRESS),
            done:  cards.filter((c) => c.status === STATUS_DONE)
        }

        this.dashboardPresenter.present(dashboard)
    }

}