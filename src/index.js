import UserHandler from './handlers/UserHandler.js'
import CardHandler from './handlers/CardHandler.js'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import DashboardHandler from './handlers/DashboardHandler.js'

const app = yargs(hideBin(process.argv))
.command('addUser [name] [email] [pass]', 'Register a new user.',{}, UserHandler.addUser)
.command('showUsers', 'Show all users.',{}, UserHandler.showUsers)
.command('showCard [id]', 'Show one Card.',{}, CardHandler.showCard)
.command('moveToInProgress [id]', 'Move Card to In Progress Column.',{}, CardHandler.moveToInProgress)
.command('moveToPending [id]', 'Move Card to Pending Column.',{}, CardHandler.moveToPending)
.command('moveToDone [id]', 'Move Card to In Done Column.',{}, CardHandler.moveToDone)
.command('addCard [title] [description] [userId]', 'Register a new card.',{}, CardHandler.addCard)
.command('showDashboard [userId]', 'Show the dashboard.',{}, DashboardHandler.showDashboard)
.command('changeUserPassword [id] [pass]','Change user password',{},UserHandler.changeUser)
.command('changeUser [id] [name] [email]','Change user',{},UserHandler.changeUser)

try {
    app.parse()
} catch (error) {
    console.log(error)
}