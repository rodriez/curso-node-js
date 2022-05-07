/**
 * @typedef {import('../services/DashboardService').Dashboard} Dashboard
 * @typedef {import('../services/DashboardService').DashboardPresenter} DashboardPresenter
 * 
 * @implements {DashboardPresenter} 
 */
export default class DashboardPresenterRepository {
    
    /**
     * @param {Dashboard} dashboard 
     */
    present(dashboard) {
        const rowAmount = Math.max(dashboard.pending.length, dashboard.inProgress.length, dashboard.done.length)
        const table = (rowAmount > 0) ? this.toTable(dashboard, rowAmount): this.emptyTable()

        console.clear()
        console.table(table)
    }

    /**@private */
    toTable(dashboard, rowAmount) {
        return Array(rowAmount).fill(0).map((_, i) => {
            return {
                "Pending": this.presentCard(dashboard.pending[i]),
                "In Progress":this.presentCard(dashboard.inProgress[i]),
                "Done": this.presentCard(dashboard.done[i]),
            }
        })
    }

    /**@private */
    presentCard(card) {
        if (card != undefined) {
            return `${card.id} - ${card.title}`
        }

        return ''
    }

    /**@private */
    emptyTable() {
        return [
            {
                "Pending": "...",
                "In Progress": "...",
                "Done": "...",
            }
        ]
    }
}