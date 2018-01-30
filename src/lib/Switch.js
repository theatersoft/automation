import {EventEmitter} from '@theatersoft/bus'
import {Type, switchActions} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'
import {store} from './'

export class Switch extends EventEmitter {
    static switches = new Map()

    static create (name) {
        const
            id = `Switch.${name}`,
            switch_ = new Switch({id, name})
        Switch.switches.set(id, switch_)
        store.dispatch(deviceSet({id, name, type: Type.Switch, value: false}))
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
        store.dispatch(deviceValueSet(id, true))
        this.emit('on', action)
    }

    OFF (action) {
        const id = this.id
        store.dispatch(deviceValueSet(id, true))
        this.emit('off', action)
    }
}
