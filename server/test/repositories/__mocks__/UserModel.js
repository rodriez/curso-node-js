let amount = 0
let err = null

export default class UserModel {

    static async count(criteria) {
        if (err) {
            throw err;
        }

        return amount
    }
}

export const userModelMock = {
    setAmount: (amount) => {
        amount = amount
    },
    setError: (err) => {
        err = err
    },
    clean: () => {
        err = null
        amount = 0
    }
}