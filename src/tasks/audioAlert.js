import {bus, proxy} from '@theatersoft/bus'
import {Type, ON, OFF} from '@theatersoft/device'
import {Switch, Task} from '@theatersoft/automation'

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
