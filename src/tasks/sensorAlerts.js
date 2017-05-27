import {log} from '../log'
import {Type} from '@theatersoft/device'
import {setFeed} from '../actions'

const select = getState => ({Device: {devices}} = getState()) => devices

const prev = (getState, _prev = {}) => f => (_state = getState()) => {
    f(_state, _prev)
    _prev = _state
}

const equalValues = (a, b) => b && a.value === b.value

const diffs = (state, prev) => Object.entries(state).reduce((o, [k,v]) => {
    if (typeof v.value !== 'object' && !equalValues(v, prev[k])) o[k] = v
    return o
}, {})

export class SensorAlerts {
    start ({store}) {
        store.subscribe(prev(select(store.getState))((state, prevState) => Object.values(diffs(state, prevState))
            .forEach(device => {
                const {name, type, value, id} = device
                let status
                switch (type) {
                case Type.MotionSensor:
                    if (value) status = 'ACTIVE'
                    break
                case Type.SecuritySensor:
                    if (prevState[id] || value) status = value ? 'OPEN' : 'CLOSED'
                    break
                }
                if (status) process.nextTick(() =>
                    store.dispatch(setFeed({
                        message: `${name} ${status}`,
                        severity: value ? 1 : 2,
                        id, type, name, status})))
            })
        ))
    }
}
