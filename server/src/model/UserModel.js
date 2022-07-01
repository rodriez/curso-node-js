import {DataTypes, Model} from 'sequelize'
/**
 * @typedef {import('../services/UserService').User} User
 */
export default class UserModel extends Model {

    /**
     * 
     * @param {*} sequelize
     * @return {*} 
     */
    static init(sequelize) {
        const tableSpec = {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            pass: DataTypes.STRING
        }

        const options = {
            sequelize: sequelize,
            modelName: "user",
            timestamps: true
        }

        // @ts-ignore
        super.init(tableSpec, options)
    }

    /**
     * @returns {User}
     */
    toUser() {
        return {
            id: this.getDataValue("id"),
            name: this.getDataValue("name"),
            email: this.getDataValue("email"),
            pass: this.getDataValue("pass"),
            createAt: this.getDataValue("createdAt"),
            updateAt: this.getDataValue("updatedAt"),
        }
    }
}