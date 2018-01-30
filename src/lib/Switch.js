import {EventEmitter} from '@theatersoft/bus'
import {Type, ON, OFF} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'
import {store} from './'

export class Switch extends EventEmitter {
    static map = new Map()

    static create (name) {
        const
            id = `Switch.${name}`,
            switch_ = new Switch({id, name})
        Switch.map.set(id, switch_)
        store.dispatch(deviceSet({id, name, type: Type.Switch, value: false}))
        return switch_
    }

    static get (id) {
        return Switch.map.get(id)
    }

    constructor ({id, name}) {
        super()
        Object.assign(this, {id, name})
    }

    dispose () {
        Switch.map.delete(this.id)
        // TODO dispose emitter
    }

    ON (action) {
        const id = this.id
        store.dispatch(deviceValueSet(id, true))
        this.emit(ON, action)
    }

    OFF (action) {
        const id = this.id
        store.dispatch(deviceValueSet(id, false))
        this.emit(OFF, action)
    }
}
