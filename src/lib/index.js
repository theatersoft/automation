import {Button} from './Button'
import {Switch} from './Switch'
import {Task} from './Task'
import * as state from './state'

export {Button, Switch, Task}

export const
    services = {Button, Switch, Task},

    lib = {
        ...services,
        ...state
    },

    store = {},
    setStore = s => Object.assign(store, s)
