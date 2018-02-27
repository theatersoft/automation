import {bus, proxy} from '@theatersoft/bus'
import {Type, ON, OFF} from '@theatersoft/device'
import {Switch, Task} from '@theatersoft/automation'

export class Feed extends Task {
    start () {
        this.switch = Switch.create(this.constructor.name)
            .on(ON, e => {
            })
            .on(OFF, e => {
            })
    }
}
