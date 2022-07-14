import CardService, { STATUS_DONE, STATUS_IN_PROGRESS, STATUS_PENDING } from "../services/CardService.js";
import DashboardService from '../services/DashboardService.js';
import DashboardPresenterRepository from '../repositories/DashboardPresenterRepository.js';
import NotificationRepository from '../repositories/NotificationRepository.js';
import CardPersistenceRestRepository from '../repositories/CardPersistenceRestRepository.js';
import UserPersistenceRestRepository from '../repositories/UserPersistenceRestRepository.js';
import AuthRepository from '../repositories/AuthRepository.js'

const authRepository = new AuthRepository(`${process.env.HOST}`, `${process.env.CREDENTIALS_FILE}`)
const notificationRepository = new NotificationRepository()
const dashboardPresenterRepo = new DashboardPresenterRepository()
const cardPersitenceRepo = new CardPersistenceRestRepository(`${process.env.HOST}`, authRepository, notificationRepository)
const userPersistenceRepo = new UserPersistenceRestRepository(`${process.env.HOST}`, authRepository)
const cardService = new CardService(cardPersitenceRepo, userPersistenceRepo);
const dashboardService = new DashboardService(cardPersitenceRepo, dashboardPresenterRepo, userPersistenceRepo)

export default class CardHandler {
    /**
     * @param {*} req 
     */
    static addCard(req) {
        cardService.addCard(req)
            .then(CardHandler.showCard)
            .catch((e) => console.log(e.message))
    }

    /**
     * @param {*} req 
     */
    static async showCard(req) {
        try {
            const card = await cardService.getCardById(req.id)

            console.clear()
            console.log(card)
        } catch (e) {
            console.log(e.message)
        }
    }

    /**
     * @param {*} req 
     */
    static async moveToInProgress(req) {
        try {
            await cardService.updateStatus(req.id, STATUS_IN_PROGRESS)

            await dashboardService.showDashboard()
        } catch (e) {
            console.log(e.message)
        }
    }

    /**
     * @param {*} req 
     */
    static async moveToPending(req) {
        try {
            await cardService.updateStatus(req.id, STATUS_PENDING)

            await dashboardService.showDashboard()
        } catch (e) {
            console.log(e.message)
        }
    }

    /**
     * @param {*} req 
     */
    static async moveToDone(req) {
        try {
            await cardService.updateStatus(req.id, STATUS_DONE)

            await dashboardService.showDashboard()
        } catch (e) {
            console.log(e.message)
        }
    }
}