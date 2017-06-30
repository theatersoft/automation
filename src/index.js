import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'remote-redux-devtools'
import reducer from './reducer'
import {bus, proxy} from '@theatersoft/bus'
import {init, api, setDevice, setSettings} from './actions'
import {log} from './log'
import * as Tasks from './tasks'

const select = getState => ({devices} = getState()) => ({devices})

const equal = (a, b, _a = Object.keys(a), _b = Object.keys(b)) => (
    _a.length === _b.length && !_a.find(k => !_b.includes(k) || a[k] !== b[k])
)

const dedup = (getState, _state = {}) => f => (_next = getState()) => {
    if (!equal(_next, _state)) {
        _state = _next
        f(_next)
    }
}

export class Automation {
    async start ({name, config: {remotedev}}) {
        this.store = createStore(reducer, {},
            (remotedev && composeWithDevTools({name, realtime: true, port: 6400, hostname: remotedev}) || (x => x))
            (applyMiddleware(thunk.withExtraArgument({})))
        )
        this.name = name
        const obj = await bus.registerObject(this.name, this)
        obj.signal('start')
        this.store.subscribe(dedup(select(this.store.getState))(state => obj.signal('state', state)))
        const register = () => bus.proxy('Device').registerService(this.name)
        bus.registerListener(`Device.start`, register)
        bus.on('reconnect', register)
        await register()

        const
            dispatchSetDevice = state => this.store.dispatch(setDevice(state)),
            dispatchSettings = state => this.store.dispatch(setSettings(state))
        bus.registerListener('Device.state', dispatchSetDevice)
        bus.registerListener('Settings.state', dispatchSettings)
        proxy('Device').getState().then(dispatchSetDevice)
        proxy('Settings').getState().then(dispatchSettings)

        this.tasks = Object.entries(Tasks).map(([name, Task]) => {
            const task = new Task()
            log(`starting task ${name}`)
            task.start(this)
            return task
        })
    }

    stop () {
        return bus.unregisterObject(this.name)
    }

    dispatch (action) {
        return this.store.dispatch(api(action))
    }

    getState () {
        return this.store.getState()
    }
}
