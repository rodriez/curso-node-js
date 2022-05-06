import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_DONE } from "../services/CardService.js"

export default class DashboardService {

    constructor(cardPersistence, dashboardPresenter, userPersistence) {
        this.cardPersistence = cardPersistence
        this.dashboardPresenter = dashboardPresenter
        this.userPersistence = userPersistence
    }

    showDashboard(req) {
        let cards = []
        if (req?.userId && !this.userPersistence.exists({id: req.userId})) {
            throw Error("Invalid userId")
        } else if (req?.userId) {
            cards = this.cardPersistence.search({ userId: req.userId })
        } else {
            cards = this.cardPersistence.all()
        }

        const dashboard = {
            pending: cards.filter((c) => c.status === STATUS_PENDING),
            inProgress: cards.filter((c) => c.status === STATUS_IN_PROGRESS),
            done:  cards.filter((c) => c.status === STATUS_DONE)
        }

        this.dashboardPresenter.present(dashboard)
    }

}