import {bus, proxy} from '@theatersoft/bus'
import {Type, buttonActions} from '@theatersoft/device'
import {Button, Task} from '@theatersoft/automation'

export class TheaterScene extends Task {
    start () {
        this.button = Button.create(this.constructor.name)
        this.button.on(buttonActions.PRESS, e => {
            const Device = bus.proxy('Device')
            Object.entries({
                'X10.A6': 'OFF',
                'ZWave.8': 'OFF',
                'ZWave.14': 'OFF',
                // 'Projector': 'ON'
            }).forEach(([id, type]) => Device.dispatch({id, type}))
        })
    }
}
