import {Type} from '@theatersoft/device'
import {INIT, SET_DEVICE, SET_FEED, SET_SETTINGS} from './actions'
import {combineReducers} from 'redux'

const
    Device = (state = {}, {type, devices}) => type === SET_DEVICE ? ({devices}) : state,
    devices = (state = {}, {type, value}) => type === SET_FEED ? ({...state, feed: {value}}) : state,
    settings = (state = {}, {type, settings}) => type === SET_SETTINGS ? settings : state

export default combineReducers({
    devices,
    Device,
    settings
})
