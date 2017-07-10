import {log} from '../log'
import {Type} from '@theatersoft/device'
import {setFeed} from '../actions'
import {bus, proxy} from '@theatersoft/bus'

const
    select = getState => ({Device: {devices}} = getState()) => devices,
    prev = (getState, _prev = {}) => f => (_state = getState()) => {
        f(_state, _prev)
        _prev = _state
    },
    diffValues = (a, b) => b && a.value !== b.value,
    diffs = (state, prev) => Object.entries(state).reduce((o, [k,v]) => {
        if (typeof v.value !== 'object' && diffValues(v, prev[k])) o[k] = v
        return o
    }, {}),
    _time = t => new Date(t).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric'}).toLowerCase()

export class SensorAlerts {
    start ({store: {subscribe, getState, dispatch}}) {
        subscribe(prev(select(getState))((state, prevState) => Object.values(diffs(state, prevState))
            .forEach(device => {
                const {name, type, value, id, time} = device
                let status
                switch (type) {
                case Type.MotionSensor:
                    if (value) status = 'ACTIVE'
                    break
                case Type.SecuritySensor:
                    if (prevState[id].value !== undefined || value) status = value ? 'OPEN' : 'CLOSED'
                    break
                }
                if (status) process.nextTick(() => {
                    dispatch(setFeed({severity: value ? 1 : 2, id, type, name, status, time}))
                    if (getState().settings.armed)
                        proxy('Session').sendPush(JSON.stringify({body: `${name} ${status} at ${_time(time)}`, icon: '/res/theatersoft-logo-round-accent.png', tag: id, renotify: false}))
                    else
                        log(`Not armed, not sending ${name} ${status}`)
                })
            })
        ))
    }
}
