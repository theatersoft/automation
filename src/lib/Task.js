import {Type, ON, OFF} from '@theatersoft/device'
import {deviceSet, deviceValueSet} from '../actions'
import {store} from '../store'
import {log} from '../log'

export class Task {
    static map = new Map()

    static get (id) {
        return Task.map.get(id)
    }

    static start (tasks, configs) {
        Object.entries(tasks).forEach(([id, Task]) => {
            const
                config = typeof configs[id] === 'object' ? configs[id] : {enabled: configs[id]},
                task = new Task(id, config)
            if (config.enabled !== false) task.ON()
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

    constructor (name, config) {
        this.id = `Task.${name}`
        this.config = config
        Task.map.set(this.id, this)
        store.dispatch(deviceSet({id: this.id, name, type: Type.Task}))
    }

    ON () {
        store.dispatch(deviceValueSet(this.id, true))
        log(`starting task ${this.id}`)
        this.start()
    }

    OFF () {
        if (this.stop) {
            log(`stopping task ${this.id}`)
            store.dispatch(deviceValueSet(this.id, false))
            this.stop()
        }
    }
}
