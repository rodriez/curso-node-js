import {describe, test, expect, jest} from '@jest/globals'
import MyStack from '../../src/tdd/MyStack.js'

describe("TDD session", () => {
    test("DADO QUE agrego un item al stack, CUANDO size es llamdo ENTONCES el tamaño del stack es 1", () => {
        const stack = new MyStack()
        stack.add("Hola")

        const result = stack.size()

        expect(result).toBe(1)
    })
    test("DADO QUE agrego 2 items al stack, CUANDO obtengo 1 ENTONCES el size es 1 y el item retornado es el ultimo que fue agregado", () => {
        const stack = new MyStack()
        stack.add("Hola")
        stack.add("Como")

        const result = stack.get()

        expect(result).toBe("Como")
        expect(stack.size()).toBe(1)
    })
    //test("Test 1", () => {
        //const stack = new MyStack()
        
        // try {
        //     stack.delete()
        // } catch(e) {
        //     expect(e.message).toBe("Empty stack")
        // }

        //expect(stack.delete()).toThrow("Empty stack")
    //})
})