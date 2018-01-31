import {EventEmitter} from '@theatersoft/bus'
import {Type, PRESS} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'
import {store} from '../store'

export class Button extends EventEmitter {
    static map = new Map()

    static create (name) {
        const
            id = `Button.${name}`,
            button = new Button({id, name})
        Button.map.set(id, button)
        store.dispatch(deviceSet({id, name, type: Type.Button, value: false}))
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
        store.dispatch(deviceValueSet(id, true))
        setTimeout(() => store.dispatch(deviceValueSet(id, false)), 250)
        this.emit(PRESS, action)
    }
}
