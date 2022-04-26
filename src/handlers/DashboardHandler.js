import DashboardService from "../services/DashboardService.js"
import CardPersistenceFileRepository from "../repositories/CardPersistenceFileRepository.js"
import DashboardPresenterRepository from "../repositories/DashboardPresenterRepository.js"

const dashboardPresenter = new DashboardPresenterRepository()
const cardPersistence = new CardPersistenceFileRepository(process.env.DB_CARD)
const service = new DashboardService(cardPersistence, dashboardPresenter)

export default class DashboardHandler {

    static showDashboard() {
        try {
            service.showDashboard()
        } catch (e) {
            console.log(e.message)
        }
    }

}