import {Type, Interface, interfaceOfType} from '@theatersoft/device'

export const
    INIT = 'INIT',
    init = () => ({type: INIT})

import {log} from './log'

export const
    API = 'API',
    api = action => (dispatch, getState) => {
    }

export const
    SET_DEVICE_DEVICES = 'SET_DEVICE_DEVICES',
    setDeviceDevices = ({devices}) => ({type: SET_DEVICE_DEVICES, devices}),
    SET_SETTINGS = 'SET_SETTINGS',
    setSettings = settings => ({type: SET_SETTINGS, settings}),
    DEVICE_SET = 'DEVICE_SET',
    deviceSet = (id, value) => ({type: DEVICE_SET, device: {id, value}})

let feedTimeout
export const
    setFeed = value => dispatch => {
        const feedSet = (value, active) => deviceSet('feed', {...value, active})
        if (feedTimeout) clearTimeout(feedTimeout)
        dispatch(feedSet(value, true))
        feedTimeout = setTimeout(() => dispatch(feedSet(value, false)), 5000)
    }
