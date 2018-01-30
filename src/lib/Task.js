import {Type, ON, OFF} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'
import {store} from './'

export class Task {
    static map = new Map()

    static get (id) {
        return Task.map.get(id)
    }

    constructor (name) {
        this.store = store
        this.id = `Task.${name}`
        Task.map.set(this.id, this)
        store.dispatch(deviceSet({id: this.id, name, type: Type.Task}))
    }

    ON () {
        store.dispatch(deviceValueSet(this.id, true))
        this.start()
    }

    OFF () {
        if (this.stop) {
            store.dispatch(deviceValueSet(this.id, false))
            this.stop()
        }
    }
}
