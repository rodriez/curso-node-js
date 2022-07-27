import {describe, test, expect} from '@jest/globals'
import CardService from '../../src/services/CardService.js'
import BadRequest from '../../src/errors/BadRequest.js'


describe("Testing CardService.addCard con requests invalidas", () => {
    const service = new CardService()

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
})