import { Sequelize } from "sequelize";
import CardModel from "./model/CardModel.js";
import UserModel from "./model/UserModel.js";

const sequelize = new Sequelize("test", "root", "rodriEz.26", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false
})

CardModel.init(sequelize)
UserModel.init(sequelize)

CardModel.belongsTo(UserModel, {
    foreignKey: "user_id"
})

sequelize.sync({force: false})