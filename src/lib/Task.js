import {Type, ON, OFF} from '@theatersoft/device'
import {taskSet} from '../actions'
import {store} from './'

export class Task {
    constructor (id) {
        Object.assign(this, {id, store})
    }

    ON () {
        store.dispatch(taskSet(this.id, true))
        this.start()
    }

    OFF () {
        store.dispatch(taskSet(this.id, false))
        this.stop()
    }
}
