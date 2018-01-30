import {Type, Interface, interfaceOfType, PRESS, ON, OFF} from '@theatersoft/device'

export const
    SET_DEVICE_DEVICES = 'SET_DEVICE_DEVICES',
    setDeviceDevices = ({devices}) => ({type: SET_DEVICE_DEVICES, devices}),
    SET_SETTINGS = 'SET_SETTINGS',
    setSettings = settings => ({type: SET_SETTINGS, settings}),
    DEVICE_SET = 'DEVICE_SET',
    deviceSet = device => ({type: DEVICE_SET, device}),
    DEVICE_VALUE_SET = 'DEVICE_VALUE_SET',
    deviceValueSet = (id, value) => ({type: DEVICE_VALUE_SET, id, value, time: Date.now()})

let feedTimeout
export const
    setFeed = value => dispatch => {
        const feedSet = (value, active) => deviceSet({id: 'feed', value: {...value, active}})
        if (feedTimeout) clearTimeout(feedTimeout)
        dispatch(feedSet(value, true))
        feedTimeout = setTimeout(() => dispatch(feedSet(value, false)), 5000)
    }

import {Button, Switch} from '../lib'

export const
    API = 'API',
    api = action => () => {
        const {id, type} = action
        if (id && type === PRESS) {
            Button.get(id).PRESS(action)
        }
        if (id && (type === ON || type === OFF)) {
            Switch.get(id)[type](action)
        }
    }
