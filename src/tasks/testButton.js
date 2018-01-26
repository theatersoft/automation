import {Type} from '@theatersoft/device'
import {bus, proxy} from '@theatersoft/bus'
import {Button} from '../Button'

export class TheaterScene {
    start ({store: {subscribe, getState, dispatch}}) {
        this.button = Button.create(this.constructor.name)
        this.button.on('press', e => {
            const Device = bus.proxy('Device')
            Object.entries({
                'X10.A6': 'OFF',
                'ZWave.8': 'OFF',
                'ZWave.14': 'OFF',
                'Projector': 'ON'
            }).forEach(([id, type]) => Device.dispatch({id, type}))
        })
    }

    stop () {
    }
}
