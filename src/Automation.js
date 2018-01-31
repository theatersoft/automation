import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'remote-redux-devtools'
import {reducer, initialState} from './reducer'
import {bus, proxy} from '@theatersoft/bus'
import {api, setDeviceDevices, setSettings} from './actions'
import {log} from './log'
import {setStore} from './store'
import {dedup} from './lib'

import * as Tasks from './tasks'

const select = getState => ({devices} = getState()) => ({devices})

export class Automation {
    async start ({name, config: {remotedev}}) {
        this.store = createStore(
            reducer, initialState,
            (remotedev && composeWithDevTools({name, realtime: true, port: 6400, hostname: remotedev}) || (x => x))
            (applyMiddleware(thunk.withExtraArgument({})))
        )
        setStore(this.store)
        this.name = name
        const obj = await bus.registerObject(this.name, this)
        obj.signal('start')
        this.store.subscribe(dedup(select(this.store.getState))(state => obj.signal('state', state)))
        const register = () => bus.proxy('Device').registerService(this.name)
        bus.registerListener(`Device.start`, register)
        bus.on('reconnect', register)
        await register()

        const
            dispatchSetDevice = state => this.store.dispatch(setDeviceDevices(state)),
            dispatchSettings = state => this.store.dispatch(setSettings(state))
        bus.registerListener('Device.state', dispatchSetDevice)
        bus.registerListener('Settings.state', dispatchSettings)
        proxy('Device').getState().then(dispatchSetDevice)
        proxy('Settings').getState().then(dispatchSettings)

        this.tasks = Object.entries(Tasks).map(([id, Task]) => {
            const task = new Task(id)
            log(`starting task ${id}`)
            task.ON()
            return task
        })
    }

    stop () {
        this.tasks.forEach(t => t.stop && t.stop())
        return bus.unregisterObject(this.name)
    }

    dispatch (action) {
        return this.store.dispatch(api(action))
    }

    getState () {
        return this.store.getState()
    }
}
