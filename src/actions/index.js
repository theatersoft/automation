import {Type, Interface, interfaceOfType, buttonActions} from '@theatersoft/device'

export const
    INIT = 'INIT',
    init = () => ({type: INIT}),
    SET_DEVICE_DEVICES = 'SET_DEVICE_DEVICES',
    setDeviceDevices = ({devices}) => ({type: SET_DEVICE_DEVICES, devices}),
    SET_SETTINGS = 'SET_SETTINGS',
    setSettings = settings => ({type: SET_SETTINGS, settings}),
    DEVICE_SET = 'DEVICE_SET',
    deviceSet = device => ({type: DEVICE_SET, device})

let feedTimeout
export const
    setFeed = value => dispatch => {
        const feedSet = (value, active) => deviceSet({id: 'feed', value: {...value, active}})
        if (feedTimeout) clearTimeout(feedTimeout)
        dispatch(feedSet(value, true))
        feedTimeout = setTimeout(() => dispatch(feedSet(value, false)), 5000)
    }

import {Button} from '../Button'
export const
    API = 'API',
    api = action => () => {
        const {id, type} = action
        if (id && type === buttonActions.PRESS) {
            Button.get(id).press()
        }
    }
