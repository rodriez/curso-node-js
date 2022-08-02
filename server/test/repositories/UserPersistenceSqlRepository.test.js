import {describe, test, expect, jest} from '@jest/globals'
import UserPersistenceSqlRepository from '../../src/repositories/UserPersistenceSqlRepository.js'
import UserModel from '../../src/model/UserModel.js'

const userModelMock = {
    count: async() =>  0
}

jest.mock('../../src/model/UserModel.js', () => {
    return {
        __esModule: true,
        default: userModelMock
    }
})

describe("Testing UserPersistenceSqlRepository.exists", () => {
    test("Test 1", async () => {
        const criteria = {
            id: ""
        }

        const repo = new UserPersistenceSqlRepository()

        const result = await repo.exists(criteria)

        expect(result).toBeFalsy()
    })

    test("Test 2", async() => {
        const criteria = {
            id: "XXXXX-XXX-XXX-XXXXX"
        }

        userModelMock.count =  async() =>  1

        const repo = new UserPersistenceSqlRepository()
        const result = await repo.exists(criteria)

        expect(result).toBeTruthy()
    })
})