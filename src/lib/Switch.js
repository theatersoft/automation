import {EventEmitter} from '@theatersoft/bus'
import {Type, switchActions} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'

export class Switch extends EventEmitter {
    static store
    static switches = new Map()
    static id = 0

    static create (name) {
        const
            id = String(Switch.id++),
            switch_ = new Switch({id, name})
        Switch.switches.set(id, switch_)
        Switch.store.dispatch(deviceSet({id, name, type: Type.Switch, value: false}))
        return switch_
    }

    static get (id) {
        return Switch.switches.get(id)
    }

    constructor ({id, name}) {
        super()
        Object.assign(this, {id, name})
    }

    dispose () {
        Switch.switches.delete(this.id)
        // TODO dispose emitter
    }

    ON (action) {
        const id = this.id
        Switch.store.dispatch(deviceValueSet(id, true))
        this.emit('on', action)
    }

    OFF (action) {
        const id = this.id
        Switch.store.dispatch(deviceValueSet(id, true))
        this.emit('off', action)
    }
}
