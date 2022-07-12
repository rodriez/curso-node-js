import './db.js';
import express from 'express';
import UserHandler from './handlers/UserHandler.js';
import CardHandler from './handlers/CardHandler.js';
import ErrorHandler from './handlers/ErrorHandler.js';
import AuthorizationHandler from './handlers/AuthorizationHandler.js';
import morgan from 'morgan'
import compression from 'compression'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use(compression())
app.use(cors())
app.use(AuthorizationHandler.checkAuth)

//Auth Endpoints
app.get("/api/login", AuthorizationHandler.login)

//User Endpoints
app.post("/api/users", UserHandler.addUser)
app.get("/api/users", UserHandler.showUsers)
app.get("/api/users/:id", UserHandler.getUser)
app.patch("/api/users/:id", UserHandler.updateUser)
app.delete("/api/users/:id", UserHandler.deleteUser)

//Cards Endpoints
app.post("/api/cards", CardHandler.addCard)
app.get("/api/cards/:id", CardHandler.getCard)
app.get("/api/cards", CardHandler.showCards)
app.patch("/api/cards/:id", CardHandler.updateStatusCard)
app.delete("/api/cards/:id", CardHandler.deleteCard)

app.use(ErrorHandler.handle)

app.listen(3000, () => {
    console.info("Server started. Listening the port: 3000")
})