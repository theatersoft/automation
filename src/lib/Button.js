import {EventEmitter} from '@theatersoft/bus'
import {Type, PRESS} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'

export class Button extends EventEmitter {
    static store
    static map = new Map()
    static id = 0

    static create (name) {
        const
            id = String(Button.id++),
            button = new Button({id, name})
        Button.map.set(id, button)
        Button.store.dispatch(deviceSet({id, name, type: Type.Button, value: false}))
        return button
    }

    static get (id) {
        return Button.map.get(id)
    }

    constructor ({id, name}) {
        super()
        Object.assign(this, {id, name})
    }

    dispose () {
        Button.map.delete(this.id)
        // TODO dispose emitter
    }

    PRESS (action) {
        const id = this.id
        Button.store.dispatch(deviceValueSet(id, true))
        setTimeout(() => Button.store.dispatch(deviceValueSet(id, false)), 250)
        this.emit(PRESS, action)
    }
}
