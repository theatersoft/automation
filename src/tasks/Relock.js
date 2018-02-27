import {bus, proxy, log} from '@theatersoft/bus'
import {Type, ON, OFF} from '@theatersoft/device'
import {Task, prev, diffs, store} from '@theatersoft/automation'

// import * as most from 'most'
// import Kefir from 'kefir'

const
    config = {
        lockId: 'ZWave2.6',
        doorId: 'ZWave.12',
        delay: 180000
    },
    select = (getState, config) => ({Device: {devices}} = getState()) => {
        const {
            [config.lockId]: lock,
            [config.doorId]: door
        } = devices
        return {
            ...lock && {lock},
            ...door && {door}
        }
    }

export class Relock extends Task {
    start () {
        this.config = config //TODO
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
