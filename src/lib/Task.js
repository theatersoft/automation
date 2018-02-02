import {Type, ON, OFF} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'
import {store} from '../store'
import {log} from '../log'

export class Task {
    static map = new Map()

    static get (id) {
        return Task.map.get(id)
    }

    static start (tasks) {
        Object.entries(tasks).forEach(([id, Task]) => {
            const task = new Task(id)
            log(`starting task ${id}`)
            task.ON()
        })
    }

    static stop () {
        Task.map.forEach(task => {
            if (task.stop) {
                log(`stopping task ${task.id}`)
                task.stop()
            }
        })
    }

    constructor (name) {
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
