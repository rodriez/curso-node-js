import {describe, test, expect, beforeEach} from '@jest/globals'
import CardService from '../../src/services/CardService.js'
import BadRequest from '../../src/errors/BadRequest.js'
import InternalError from '../../src/errors/InternalError.js'
import CardPersistenceMock from './__mocks__/CardPeristenceMock.js'
import UserPersistenceMock from './__mocks__/UserPersistenceMock.js'


describe("Testing CardService.addCard con requests invalidas", () => {
    const cardPersistenceMock = new CardPersistenceMock();
    // let tempCard;
    // const cardPersistenceMock = {
    //     addCard: jest.fn().mockImplementation((card) => {
    //         tempCard = card
    //     }),
    //     getCardById: jest.fn().mockImplementation((id) => tempCard)
    // }

    const userPersistenceMock = new UserPersistenceMock()
    // const userPersistenceMock = {
    //     getUserById: jest.fn().mockImplementation((id) => {
    //         return {
    //             id: id,
    //             name: "Test user",
    //             email: "user@test.com",
    //             pass: "12345",
    //             createAt: new Date(),
    //             updateAt: new Date(),
    //             extra: true
    //         }
    //     })
    // }


    beforeEach(() => {
        cardPersistenceMock.clean()
        userPersistenceMock.clean()
    })

    const service = new CardService(cardPersistenceMock, userPersistenceMock)

    test("DADO QUE recibo una request con un titulo invalido, CUANDO se ejecuta addCard ENTONCES lanza un BadRequest(Invalid title)", async () => {
        const request = {
            title: ""
        }
        
        await expect(service.addCard(request)).rejects.toEqual(new BadRequest("Invalid title"))
    })

    test("DADO QUE recibo una request vacia, CUANDO se ejecuta addCard ENTONCES lanza un BadRequest(Invalid title)", async() => {
        const request = {}
        
        await expect(service.addCard(request)).rejects.toEqual(new BadRequest("Invalid title"))
    })

    test("DADO QUE recibo una request con descripcion vacia, CUANDO se ejecuta addCard ENTONCES lanza un BadRequest(Invalid description)", async() => {
        const request = {
            title: "Test Card"
        }
        
        await expect(service.addCard(request)).rejects.toEqual(new BadRequest("Invalid description"))
    })

    test("DADO QUE recibo una request con descripcion invalida, CUANDO se ejecuta addCard ENTONCES lanza un BadRequest(Invalid description)", async() => {
        const request = {
            title: "Test Card",
            description: ""
        }
        
        await expect(service.addCard(request)).rejects.toEqual(new BadRequest("Invalid description"))
    })

    test("DADO QUE recibo una request sin userId, CUANDO se ejecuta addCard ENTONCES lanza un BadRequest(Invalid userId)", async() => {
        const request = {
            title: "Test Card",
            description: "Test Description"
        }
        
        await expect(service.addCard(request)).rejects.toEqual(new BadRequest("Invalid userId"))
    })

    test("DADO QUE recibo una request con userId invalido, CUANDO se ejecuta addCard ENTONCES lanza un BadRequest(Invalid userId)", async() => {
        const request = {
            title: "Test Card",
            description: "Test Description",
            userId: ""
        }
        
        await expect(service.addCard(request)).rejects.toEqual(new BadRequest("Invalid userId"))
    })

    test("DADO QUE recibo una request valida, CUANDO se ejecuta addCard ENTONCES se guarda la card y devuelve la info", async() => {
        userPersistenceMock.user = {
            id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            name: "Test user",
            email: "user@test.com",
            pass: "12345",
            createAt: new Date(),
            updateAt: new Date(),
            extra: true
        }

        const request = {
            title: "Test Card",
            description: "Test Description",
            userId: userPersistenceMock.user.id
        }
        
        const startTime = new Date()
        const result = await service.addCard(request)

        expect(result.id).not.toBeUndefined()
        expect(result.id).not.toBe("")
        expect(result.title).not.toBeUndefined()
        expect(result.title).toBe(request.title)
        expect(result.description).not.toBeUndefined()
        expect(result.description).toBe(request.description)
        expect(result.user).not.toBeUndefined()
        expect(result.user).toEqual({
            id: request.userId,
            name: "Test user",
            email: "user@test.com"
        })
        expect(result.createAt).not.toBeUndefined()
        expect(result.createAt?.getTime()).toBeGreaterThanOrEqual(startTime.getTime())
        expect(result.updateAt).not.toBeUndefined()
        expect(result.updateAt?.getTime()).toBeGreaterThanOrEqual(startTime.getTime())
    })

    test("DADO QUE recibo una request valida, CUANDO se ejecuta addCard y lanza un error el repositorio ENTONCES me lanza un error InternalError(Oops something were wrong!!!)", async() => {
        cardPersistenceMock.error = Error("La base esta caida")

        const request = {
            title: "Test Card",
            description: "Test Description",
            userId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }

        await expect(service.addCard(request)).rejects.toEqual(new InternalError("Oops something were wrong!!!"))
    })
})