import UserHandler from './handlers/UserHandler.js'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'


const app = yargs(hideBin(process.argv))
.command('addUser [name] [email] [pass]', 'Register a new user.',{}, UserHandler.addUser)
.command('showUsers', 'Show all users.',{}, UserHandler.showUsers)

try {
    app.parse()
} catch (error) {
    console.log(error)
}