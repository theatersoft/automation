import {EventEmitter} from '@theatersoft/bus'
import {Type, buttonActions} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from './actions'

export class Button extends EventEmitter {
    static store
    static buttons = new Map()
    static id = 0

    static create (name) {
        const
            id = String(Button.id++),
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
        Button.store.dispatch(deviceValueSet(id, true))
        setTimeout(() => Button.store.dispatch(deviceValueSet(id, false)), 250)
        this.emit(buttonActions.PRESS)
    }

    dispose () {
        Button.buttons.delete(this.id)
        // TODO dispose emitter
    }
}
