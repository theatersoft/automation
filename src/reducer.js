import {Type} from '@theatersoft/device'
import {INIT, SET_DEVICE, SET_FEED} from './actions'
import {combineReducers} from 'redux'

const Device = (state = {}, action) => {
    if (action.type === SET_DEVICE)
        return {devices: action.devices}
    return state
}

const devices = (state = {}, action) => {
    if (action.type === SET_FEED) {
        const {value} = action
        return {...state, feed: {value}}
    }
    return state
}

export default combineReducers({
    devices,
    Device
})
