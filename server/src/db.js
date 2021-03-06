import { Sequelize } from "sequelize";
import CardModel from "./model/CardModel.js";
import UserModel from "./model/UserModel.js";
import {sequelizeStream} from "./logger.js";

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
    host: `${process.env.DB_HOST}`,
    port: parseInt(`${process.env.DB_PORT}`, 10),
    dialect: "mysql",
    logging: sequelizeStream 
})

CardModel.init(sequelize)
UserModel.init(sequelize)

CardModel.belongsTo(UserModel, {
    foreignKey: "user_id"
})

sequelize.sync({force: false})