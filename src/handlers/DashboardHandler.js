import DashboardService from "../services/DashboardService.js"
import DashboardPresenterRepository from "../repositories/DashboardPresenterRepository.js"
import UserPeristenceFileRepository from "../repositories/UserPersistenceFileRepository.js"
import CardPersistenceSqlRepository from "../repositories/CardPersistenceSqlRepository.js"

const userPersistence = new UserPeristenceFileRepository(`${process.env.DB_USER}`)
const dashboardPresenter = new DashboardPresenterRepository()
//const cardPersistence = new CardPersistenceFileRepository(`${process.env.DB_CARD}`)
const cardPersistence = new CardPersistenceSqlRepository()
const service = new DashboardService(cardPersistence, dashboardPresenter, userPersistence)

export default class DashboardHandler {

    /**
     * @param {*} req 
     */
    static async showDashboard(req) {
        try {
            await service.showDashboard(req)
        } catch (e) {
            console.log(e.message)
        }
    }

}