import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_DONE } from "../services/CardService.js"

export default class DashboardService {

    constructor(cardService, dashboardPresenter) {
        this.cardService = cardService
        this.dashboardPresenter = dashboardPresenter
    }

    showDashboard() {
        const cards = this.cardService.all()

        const dashboard = {
            pending: cards.filter((c) => c.status === STATUS_PENDING),
            inProgress: cards.filter((c) => c.status === STATUS_IN_PROGRESS),
            done:  cards.filter((c) => c.status === STATUS_DONE)
        }

        this.dashboardPresenter.present(dashboard)
    }

}