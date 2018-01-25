import {log} from '../log'
import {Type} from '@theatersoft/device'
import {bus, proxy} from '@theatersoft/bus'
import {Button} from '../Button'

export class TestButton {
    start ({store: {subscribe, getState, dispatch}}) {
        this.button = Button.create(this.constructor.name)
        this.button.on('press', e => {
            log()
        })
    }

    stop () {
    }
}
