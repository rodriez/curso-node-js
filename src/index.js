import UserHandler from './handlers/UserHandler.js'
import CardHandler from './handlers/CardHandler.js'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'


const app = yargs(hideBin(process.argv))
.command('addUser [name] [email] [pass]', 'Register a new user.',{}, UserHandler.addUser)
.command('showUsers', 'Show all users.',{}, UserHandler.showUsers)
.command('showCard [id]', 'Show one Card.',{}, CardHandler.showCard)
.command('addCard [title] [description] [userId]', 'Register a new card.',{}, CardHandler.addCard)

try {
    app.parse()
} catch (error) {
    console.log(error)
}