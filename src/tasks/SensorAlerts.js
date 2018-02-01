import {debug} from '../log'
import {Type} from '@theatersoft/device'
import {setFeed} from '../actions'
import {bus, proxy} from '@theatersoft/bus'
import {Task, prev, diffs, store} from '@theatersoft/automation'

const
    select = getState => ({Device: {devices}} = getState()) => devices,
    _time = t => new Date(t).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric'}).toLowerCase()

export class SensorAlerts extends Task {
    start () {
        const {subscribe, getState, dispatch} = store
        this.unsubscribe = subscribe(prev(select(getState))((state, prevState) => Object.values(diffs(state, prevState))
            .forEach(device => {
                const {name, type, value, id, time} = device
                let status
                switch (type) {
                case Type.MotionSensor:
                    if (value) status = 'ACTIVE'
                    break
                case Type.OpenSensor:
                    if (prevState[id].value !== undefined || value) status = value ? 'OPEN' : 'CLOSED'
                    break
                }
                if (status) process.nextTick(() => {
                    if (getState().settings[`${id}.disabled`]) {
                        debug(`${name} is disabled, ignoring ${status}`)
                        return
                    }
                    dispatch(setFeed({severity: value ? 1 : 2, id, type, name, status, time}))
                    if (getState().settings['Automation.armed'])
                        proxy('Session').sendPush(JSON.stringify({body: `${name} ${status} at ${_time(time)}`, icon: '/res/theatersoft-logo-round-accent.png', tag: id, renotify: false}))
                    else
                        debug(`Not armed, not sending ${name} ${status}`)
                })
            })
        ))
    }

    stop () {
        if (this.unsubscribe) {
            this.unsubscribe()
            delete this.unsubscribe
        }
    }
}
