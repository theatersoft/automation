import {EventEmitter} from '@theatersoft/bus'
import {Type} from '@theatersoft/device'
import {deviceSet} from './actions'

export class Button extends EventEmitter {
    static store
    static buttons = new Map()
    static id = 0

    static start () {}

    static stop () {}

    static create (name) {
        const
            id = Button.id++,
            button = new Button({id, name})
        Button.buttons.set(id, button)
        Button.store.dispatch(deviceSet({id, name, type: Type.Button, value: false}))
        return button
    }

    static get (id) {
        return Button.buttons.get(id)
    }

    constructor ({id, name}) {
        super()
        Object.assign(this, {id, name})
    }

    press () {
        const id = this.id
        Button.store.dispatch(deviceSet({id, value: true}))
        setTimeout(() => Button.store.dispatch(deviceSet({id, value: false}), 10))
    }

    dispose () {
        Button.buttons.delete(name, this)
    }
}
