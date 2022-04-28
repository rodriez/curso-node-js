import dotenv from 'dotenv'
import CardService, { STATUS_DONE, STATUS_IN_PROGRESS, STATUS_PENDING } from "../services/CardService.js";
import CardPersistenceFileRepository from "../repositories/CardPersistenceFileRepository.js";
import DashboardService from '../services/DashboardService.js';
import DashboardPresenterRepository from '../repositories/DashboardPresenterRepository.js';

dotenv.config()

const dashboardPresenterRepo = new DashboardPresenterRepository()
const cardPersitenceRepo = new CardPersistenceFileRepository(process.env.DB_CARD)
const cardService = new CardService(cardPersitenceRepo);
const dashboardService = new DashboardService(cardPersitenceRepo, dashboardPresenterRepo)

export default class CardHandler {
    static addCard(req) {
        try {
            const newCard = cardService.addCard(req)
            CardHandler.showCard(newCard)

        } catch (e) {
            console.log(e.message)
        }
    }


    static showCard(req) {

        try {
            const card = cardService.getCardById(req.id)
            console.clear()
            console.log(card)

        } catch (e) {

            console.log(e.message)
        }
    }

    static moveToInProgress(req) {
        try {
            cardService.updateStatus(req.id, STATUS_IN_PROGRESS)

            dashboardService.showDashboard()
        } catch(e) {
            console.log(e.message)
        }
    }

    static moveToPending(req) {
        try {
            cardService.updateStatus(req.id, STATUS_PENDING)

            dashboardService.showDashboard()
        } catch(e) {
            console.log(e.message)
        }
    }

    static moveToDone(req) {
        try {
            cardService.updateStatus(req.id, STATUS_DONE)

            dashboardService.showDashboard()
        } catch(e) {
            console.log(e.message)
        }
    }

}