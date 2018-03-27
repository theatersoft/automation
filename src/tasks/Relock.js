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
    }

export class Relock extends Task {
    start () {
        const {subscribe, getState, dispatch} = store
        this.unsubscribe = subscribe(prev(select(getState, this.config))((state, prevState) => {
                // log(diffs(state, prevState))
            }
        ))
    }

    stop () {
        if (this.unsubscribe) {
            this.unsubscribe()
            delete this.unsubscribe
        }
    }
}
