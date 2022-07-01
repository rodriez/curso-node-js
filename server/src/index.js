import './db.js';
import express from 'express';
import UserHandler from './handlers/UserHandler.js';
import ErrorHandler from './handlers/ErrorHandler.js';

const app = express()
app.use(express.json())

//User Endpoints
app.post("/api/users", UserHandler.addUser)
app.get("/api/users/:id", UserHandler.getUser)

app.use(ErrorHandler.handle)

app.listen(3000, () => {
    console.info("Server started. Listening the port: 3000")
})

// yargs(hideBin(process.argv))
// //User Commands
// .command('addUser [name] [email] [pass]', 'Register a new user.',{}, UserHandler.addUser)
// .command('showUsers', 'Show all users.',{}, UserHandler.showUsers)
// .command('changeUserPassword [id] [pass]','Change user password',{},UserHandler.changeUser)
// .command('changeUser [id] [name] [email]','Change user',{},UserHandler.changeUser)
// //Card Commands
// .command('addCard [title] [description] [userId]', 'Register a new card.',{}, CardHandler.addCard)
// .command('showCard [id]', 'Show one Card.',{}, CardHandler.showCard)
// .command('moveToInProgress [id]', 'Move Card to In Progress Column.',{}, CardHandler.moveToInProgress)
// .command('moveToPending [id]', 'Move Card to Pending Column.',{}, CardHandler.moveToPending)
// .command('moveToDone [id]', 'Move Card to In Done Column.',{}, CardHandler.moveToDone)
// //Dashboard Commands
// .command('showDashboard [userId]', 'Show the dashboard.',{}, DashboardHandler.showDashboard)


// try {
//     app.parse()
// } catch (error) {
//     console.log(error)
// }