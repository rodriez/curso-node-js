export default class DashboardPresenterRepository {
    
    present(dashboard) {
        const rowAmount = Math.max(dashboard.pending.length, dashboard.inProgress.length, dashboard.done.length)
        const table = (rowAmount > 0) ? this.toTable(dashboard, rowAmount): this.emptyTable()

        console.clear()
        console.table(table)
    }

    toTable(dashboard, rowAmount) {
        return Array(rowAmount).fill(0).map((_, i) => {
            return {
                "Pending": this.presentCard(dashboard.pending[i]),
                "In Progress":this.presentCard(dashboard.inProgress[i]),
                "Done": this.presentCard(dashboard.done[i]),
            }
        })
    }

    presentCard(card) {
        if (card != undefined) {
            return `${card.id} - ${card.title}`
        }

        return ''
    }

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