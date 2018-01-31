import {bus, proxy} from '@theatersoft/bus'
import {Type, switchActions} from '@theatersoft/device'
import {lib} from '@theatersoft/automation'
const
    {ON, OFF} = switchActions,
    {Switch, Task} = lib

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
