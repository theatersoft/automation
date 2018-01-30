import {Type} from '@theatersoft/device'
import {SET_DEVICE_DEVICES, SET_SETTINGS, DEVICE_SET, DEVICE_VALUE_SET,TASK_SET} from './actions'
import {log} from './log'

export const reducer = (state, action) => {
    switch (action.type) {
    case SET_DEVICE_DEVICES: {
        const {devices} = action
        return {
            ...state, Device: {devices}
        }
    }
    case SET_SETTINGS: {
        const {settings} = action
        return {
            ...state, settings
        }
    }
    case DEVICE_SET: {
        log(DEVICE_SET, action)
        const {device} = action
        return {
            ...state, devices: {
                ...state.devices, [device.id]: device
            }
        }
    }
    case DEVICE_VALUE_SET: {
        log(action)
        const
            {id, value, time} = action,
            device = state.devices[id]
        return {
            ...state, devices: {
                ...state.devices, [id]: time ? {...device, value, time} : {...device, value}
            }
        }
    }
    case TASK_SET: {
        log(TASK_SET, action)
        const {id, value} = action
        return {
            ...state, tasks: {
                ...state.tasks, [id]: {id, value}
            }
        }
    }
    }
    return state
}

export const initialState = {Device: {devices: {}}, settings: {}, devices: {}}
