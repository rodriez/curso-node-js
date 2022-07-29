import {describe, test, expect, beforeEach} from '@jest/globals'
import CardService from '../../src/services/CardService.js'
import BadRequest from '../../src/errors/BadRequest.js'
import InternalError from '../../src/errors/InternalError.js'
import CardPersistenceMock from './__mocks__/CardPeristenceMock.js'
import UserPersistenceMock from './__mocks__/UserPersistenceMock.js'
import NotFound from '../../src/errors/NotFound.js'

function buildMockedService() {
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

    return new CardService(cardPersistenceMock, userPersistenceMock)
}

describe("Testing CardService.addCard", () => {

    const service = buildMockedService()

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
        service.userService.user = {
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
            userId: service.userService.user.id
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
        service.cardPersistence.error = Error("La base esta caida")

        const request = {
            title: "Test Card",
            description: "Test Description",
            userId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }

        await expect(service.addCard(request)).rejects.toEqual(new InternalError("Oops something were wrong!!!"))
    })
})

describe("Testing CardService.getCardById", () => {

    const service = buildMockedService()

    test("DADO un id de card que no existe CUAND getCardById es invocado ENTONCES lanza un error NotFound", async () => {
        const cardId = "XXX"

        service.cardPersistence.error = new NotFound("Card not found")

        await expect(service.getCardById(cardId)).rejects.toThrow(NotFound)
    })

    test("DADO un id de card invalido CUAND getCardById es invocado ENTONCES lanza un error BadRequest", async () => {
        const cardId = ""

        await expect(service.getCardById(cardId)).rejects.toThrow(BadRequest)
    })

    test("DADO un id de card valido y que existe CUANDO getCardById es invocado y getUserById lanza un error ENTONCES se lanza un InternalError(Oops something were wrong!!!)", async () => {
        const cardId = "XXXXXXXXX"

        service.cardPersistence.card = {
            id: "XXXXXXXXX",
            title: "Test Card",
            description: "Test Description",
            userId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            createAt: new Date(),
            updateAt: new Date(),
        }

        service.userService.error = Error("The db is down")

        await expect(service.getCardById(cardId)).rejects.toEqual(new InternalError("Oops something were wrong!!!"))
    })

    test("DADO un id de card valido y que existe CUANDO getCardById es invocado ENTONCES se devuelve la info de la card correctamente)", async () => {
        const cardId = "XXXXXXXXX"

        service.cardPersistence.card = {
            id: "XXXXXXXXX",
            title: "Test Card",
            description: "Test Description",
            userId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            createAt: new Date(),
            updateAt: new Date(),
        }

        service.userService.user = {
            id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            name: "Test user",
            email: "user@test.com",
            pass: "12345",
            createAt: new Date(),
            updateAt: new Date(),
            extra: true
        }

        const result = await service.getCardById(cardId)

        expect(result.id).not.toBeUndefined()
        expect(result.id).not.toBe("")
        expect(result.title).not.toBeUndefined()
        expect(result.title).toBe("Test Card")
        expect(result.description).not.toBeUndefined()
        expect(result.description).toBe("Test Description")
        expect(result.user).not.toBeUndefined()
        expect(result.user).toEqual({
            id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            name: "Test user",
            email: "user@test.com"
        })
        expect(result.createAt).not.toBeUndefined()
        expect(result.createAt?.getTime()).toBeGreaterThanOrEqual(0)
        expect(result.updateAt).not.toBeUndefined()
        expect(result.updateAt?.getTime()).toBeGreaterThanOrEqual(0)
    })
})

describe("Testing CardService.getCards", () => {
    const service = buildMockedService()
    
    test("DADO que recibimos una request con un id invalido, CUANDO se ejecuta getCards ENTONCES se va lanzar un BadRequest", async () => {
        const request = {
            id: ""
        }

        await expect(service.getCards(request)).rejects.toThrow(BadRequest)
    })

    test("DADO que recibimos una request con un id valido, CUANDO se ejecuta getCards y el repositorio lanza una error ENTONCES se va lanzar un InternalError(Oops something were wrong!!!)", async () => {
        const request = {
            id: "XXXXXX"
        }

        service.cardPersistence.error = Error("The db is down")

        await expect(service.getCards(request)).rejects.toEqual(new InternalError("Oops something were wrong!!!"))
    })

})