import dotenv from 'dotenv'
import CardService, { STATUS_DONE, STATUS_IN_PROGRESS, STATUS_PENDING } from "../services/CardService.js";
import CardPersistenceFileRepository from "../repositories/CardPersistenceFileRepository.js";
import DashboardService from '../services/DashboardService.js';
import DashboardPresenterRepository from '../repositories/DashboardPresenterRepository.js';
import UserService from '../services/UserService.js';
import UserPeristenceFileRepository from '../repositories/UserPersistenceFileRepository.js';
import NotificationRepository from '../repositories/NotificationRepository.js';
import CardPersistenceSqlRepository from '../repositories/CardPersistenceSqlRepository.js';

dotenv.config()

const notificationRepository = new NotificationRepository()
const userPersistenceRepo = new UserPeristenceFileRepository(`${process.env.DB_USER}`)
const userService = new UserService(userPersistenceRepo)
const dashboardPresenterRepo = new DashboardPresenterRepository()
//const cardPersitenceRepo = new CardPersistenceFileRepository(`${process.env.DB_CARD}`, notificationRepository)
const cardPersitenceRepo = new CardPersistenceSqlRepository(notificationRepository)
const cardService = new CardService(cardPersitenceRepo, userService);
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

            dashboardService.showDashboard()
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

            dashboardService.showDashboard()
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

            dashboardService.showDashboard()
        } catch (e) {
            console.log(e.message)
        }
    }
}