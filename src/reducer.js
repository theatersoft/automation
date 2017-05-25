import {Type} from '@theatersoft/device'
import {INIT, SET_DEVICES} from './actions'
import {combineReducers} from 'redux'

const Device = (state = {}, action) => {
    if (action.type === SET_DEVICES)
        return {devices: action.devices}
    return state
}

const devices = (state = {}) => state

export default combineReducers({
    devices,
    Device
})
