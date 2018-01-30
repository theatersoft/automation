import {Type, ON, OFF} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'
import {store} from './'

export class Task {
    constructor (name) {
        this.store = store
        this.id = `Task.${name}`
        store.dispatch(deviceSet({id: this.id, name, type: Type.Task}))
    }

    ON () {
        store.dispatch(deviceValueSet(this.id, true))
        this.start()
    }

    OFF () {
        store.dispatch(deviceValueSet(this.id, false))
        this.stop()
    }
}
