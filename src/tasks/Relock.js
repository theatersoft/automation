import {bus, proxy, log} from '@theatersoft/bus'
import {Type, ON, OFF} from '@theatersoft/device'
import {Task, prev, diffs, store} from '@theatersoft/automation'

const
    select = (getState, config) => ({Device: {devices}} = getState()) => {
        const {
            [config.lock]: lock,
            [config.door]: door
        } = devices
        return {
            ...lock && {lock},
            ...door && {door}
        }
    },
    diff = f => (curr, prev) => {
        const delta = diffs(curr, prev)
        if (Object.values(delta).length) f(delta, curr)
    }

export class Relock extends Task {
    startTimer () {
        log(`Relock in ${this.config.delay}s`)
        this.timer = setTimeout(() => {
            log('Relock')
            bus.proxy('Device').dispatch({id: this.config.lock, type: ON})
            delete this.timer
        }, this.config.delay * 1000)
    }

    killTimer () {
        if (this.timer) {
            log('Relock cancelled')
            clearTimeout(this.timer)
            delete this.timer
        }
    }

    start () {
        const {subscribe, getState} = store
        this.unsubscribe = subscribe(prev(select(getState, this.config))(diff((_, {lock, door}) => {
            if (!lock.value && !door.value) this.startTimer()
            else this.killTimer()
        })))
    }

    stop () {
        if (this.unsubscribe) {
            this.unsubscribe()
            delete this.unsubscribe
        }
        this.killTimer()
    }
}
