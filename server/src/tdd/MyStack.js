export default class MyStack {

    constructor() {
        this.collection = []
    }

    size() {
        return this.collection.length
    }

    add(item) {
        this.collection.push(item)
    }

    get() {
        const idx = this.collection.length-1
        const item = this.collection[idx]
        
        this.collection.splice(idx, 1)
        
        return item
    }

    // delete() {
    //     if (this.collection.length <= 0) {
    //         throw new Error("Empty stack")
    //     }
        
    //     const idx = this.collection.length-1
    //     this.collection.splice(idx, 1)
    // }

}