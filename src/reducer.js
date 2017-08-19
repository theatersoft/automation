import {Type} from '@theatersoft/device'
import {INIT, SET_DEVICE, SET_FEED, SET_SETTINGS} from './actions'

export const reducer = (state, action) => {
    switch (action.type) {
    case SET_DEVICE:
    {
        const {devices} = action
        return {
            ...state, Device: {devices}
        }
    }
    case SET_FEED:
    {
        const {value} = action
        return {
            ...state, devices: {
                ...state.devices, feed: {value}
            }
        }
    }
    case SET_SETTINGS:
    {
        const {settings} = action
        return {
            ...state, settings
        }
    }
    }
    return state
}

export const initialState = {devices: {}, Device: {devices: {}}, settings: {}}
