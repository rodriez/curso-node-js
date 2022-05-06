import DashboardService from "../services/DashboardService.js"
import CardPersistenceFileRepository from "../repositories/CardPersistenceFileRepository.js"
import DashboardPresenterRepository from "../repositories/DashboardPresenterRepository.js"
import UserPeristenceFileRepository from "../repositories/UserPersistenceFileRepository.js"

const userPersistence = new UserPeristenceFileRepository(process.env.DB_USER)
const dashboardPresenter = new DashboardPresenterRepository()
const cardPersistence = new CardPersistenceFileRepository(process.env.DB_CARD)
const service = new DashboardService(cardPersistence, dashboardPresenter, userPersistence)

export default class DashboardHandler {

    static showDashboard(req) {
        try {
            service.showDashboard(req)
        } catch (e) {
            console.log(e.message)
        }
    }

}