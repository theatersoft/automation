import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'remote-redux-devtools'
import reducer from './reducer'
import {bus, proxy} from '@theatersoft/bus'
import {init, api, setDevices} from './actions'
import {log} from './log'
import os from 'os'
import * as Tasks from './tasks'

export class Automation {
    async start ({name, config: {remotedev}}) {
        this.store = createStore(reducer, {devices: {}},
            (remotedev && composeWithDevTools({name, realtime: true, port: 6400, hostname: remotedev}) || (x => x))
            (applyMiddleware(thunk.withExtraArgument({})))
        )
        this.name = name
        const obj = await bus.registerObject(this.name, this)
        obj.signal('start')
        //this.store.subscribe(() => obj.signal('state', this.getState()))
        const register = () => bus.proxy('Device').registerService(this.name)
        bus.registerListener(`Device.start`, register)
        bus.on('reconnect', register)
        await register()

        const
            dispatchSetDevices = state => this.store.dispatch(setDevices(state))
        bus.registerListener('Device.state', dispatchSetDevices)
        proxy('Device').getState().then(dispatchSetDevices)


        log('starting tasks', Tasks)
        this.tasks = Object.entries(Tasks).map(([name, Task]) => {
            const task = new Task()
            log(`starting task ${name}`)
            task.start(this, this.store)
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
        return {} //this.store.getState()
    }
}
