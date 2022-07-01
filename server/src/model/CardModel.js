import {DataTypes, Model} from 'sequelize'

/**
 * @typedef {import('../services/CardService').Card} Card
 */
export default class CardModel extends Model {

    /**
     * 
     * @param {*} sequelize
     * @returns {*} 
     */
    static init(sequelize) {
        const tableSpec = {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            user_id: DataTypes.STRING,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            status: DataTypes.STRING
        }

        const options = {
            sequelize: sequelize,
            modelName: "card",
            timestamps: true
        }

        // @ts-ignore
        super.init(tableSpec, options)
    }

    /**
     * 
     * @param {Card} card 
     * @returns {*}
     */
    static fromCard(card) {
        const result = {}

        if (card?.id)
            result.id = card?.id

        if (card?.userId)
            result.user_id = card?.userId
        
        if (card?.title)
            result.title = card?.title
        
        if (card?.description)
            result.description = card?.description
        
        if (card?.status)
            result.status = card?.status
        
        if (card?.createAt)
            result.createdAt = card?.createAt
        
        if (card?.updateAt)
            result.updatedAt = card?.updateAt

        return result
    }

    /**
     * 
     * @returns {Card}
     */
    toCard() {
        return {
            id: this.getDataValue("id"),
            userId: this.getDataValue("user_id"),
            title: this.getDataValue("title"),
            description: this.getDataValue("description"),
            status: this.getDataValue("status"),
            createAt: this.getDataValue("createdAt"),
            updateAt: this.getDataValue("updatedAt")
        }
    }
}