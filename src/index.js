import UserHandler from './handlers/UserHandler.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const app = yargs(hideBin(process.argv))
.command('addUser [name] [email] [pass]', 'Register a new user.',{}, UserHandler.addUser)
.command('showUsers', 'Show all users.',{}, UserHandler.showUsers)

try {
    app.parse()
} catch (error) {
    console.log(error)
}