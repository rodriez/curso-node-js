import './env.js'
import UserHandler from './handlers/UserHandler.js'
import CardHandler from './handlers/CardHandler.js'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import DashboardHandler from './handlers/DashboardHandler.js'
import AuthHandler from './handlers/AuthHandler.js'

const app = yargs(hideBin(process.argv))
//Login Command
.command('login [email] [pass]', 'Initialized a new session.',{}, AuthHandler.login)
//User Commands
.command('addUser [name] [email] [pass]', 'Register a new user.',{}, UserHandler.addUser)
.command('showUsers', 'Show all users.',{}, UserHandler.showUsers)
.command('changeUserPassword [id] [pass]','Change user password',{},UserHandler.changeUser)
.command('changeUser [id] [name] [email]','Change user',{},UserHandler.changeUser)
//Card Commands
.command('addCard [title] [description] [userId]', 'Register a new card.',{}, CardHandler.addCard)
.command('showCard [id]', 'Show one Card.',{}, CardHandler.showCard)
.command('moveToInProgress [id]', 'Move Card to In Progress Column.',{}, CardHandler.moveToInProgress)
.command('moveToPending [id]', 'Move Card to Pending Column.',{}, CardHandler.moveToPending)
.command('moveToDone [id]', 'Move Card to In Done Column.',{}, CardHandler.moveToDone)
//Dashboard Commands
.command('showDashboard [userId]', 'Show the dashboard.',{}, DashboardHandler.showDashboard)


try {
    app.parse()
} catch (error) {
    console.log(error)
}