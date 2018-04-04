import {bus, log} from '@theatersoft/bus'
import {on} from '@theatersoft/device'
import {Task, prev, store} from '@theatersoft/automation'

export class Relock extends Task {
    startTimer () {
        log(`Relock in ${this.config.delay}s`)
        this.timer = setTimeout(() => {
            log('Relock')
            bus.proxy('Device').dispatch(on(this.config.lock))
            delete this.timer
        }, this.config.delay * 1000)
    }

    cancelTimer () {
        if (this.timer) {
            log('Relock cancelled')
            clearTimeout(this.timer)
            delete this.timer
        }
    }

    start () {
        const
            select = (getState, config) => ({Device: {devices}} = getState()) => {
                const {
                    [config.lock]: lock,
                    [config.door]: door
                } = devices
                return {
                    ...lock && {lock: lock.value},
                    ...door && {door: door.value}
                }
            }
        this.unsubscribe = store.subscribe(prev(select(store.getState, this.config))((curr, prev) => {
                if (prev.lock !== undefined && prev.door !== undefined && (prev.lock !== curr.lock || prev.door !== curr.door)) {
                    if (curr.lock === false && curr.door === false) this.startTimer()
                    else this.cancelTimer()
                }
            }
        ))
    }

    stop () {
        if (this.unsubscribe) {
            this.unsubscribe()
            delete this.unsubscribe
        }
        this.cancelTimer()
    }
}
