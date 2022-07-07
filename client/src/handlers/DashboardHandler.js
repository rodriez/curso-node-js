import DashboardService from "../services/DashboardService.js"
import DashboardPresenterRepository from "../repositories/DashboardPresenterRepository.js"
import CardPersistenceRestRepository from "../repositories/CardPersistenceRestRepository.js"
import UserPersistenceRestRepository from "../repositories/UserPersistenceRestRepository.js"

const cardPersistence = new CardPersistenceRestRepository(process.env.HOST)
const userPersistence = new UserPersistenceRestRepository(process.env.HOST)
const dashboardPresenter = new DashboardPresenterRepository()
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