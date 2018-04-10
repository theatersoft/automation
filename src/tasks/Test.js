import {bus, log} from '@theatersoft/bus'
import {on} from '@theatersoft/device'
import {Task, store} from '@theatersoft/automation'
import {from} from 'most'

export class Test extends Task {
    start () {
        this.stream = from(store)
        this.stream.forEach(log)
    }

    stop () {

    }
}
