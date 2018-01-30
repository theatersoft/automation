import {Type, switchActions} from '@theatersoft/device'
import {bus, proxy} from '@theatersoft/bus'
import {Switch, Task} from '../lib'

const {ON, OFF} = switchActions

export class AudioAlert extends Task {
    start () {
        this.switch = Switch.create(this.constructor.name)
            .on(ON, e => {
                proxy('Device').dispatch({
                    type: ON,
                    id: 'ZWave.25'
                })
            })
            .on(OFF, e => {
                proxy('Device').dispatch({
                    type: OFF,
                    id: 'ZWave.25'
                })
            })
    }
}
