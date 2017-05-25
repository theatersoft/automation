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
    SET_DEVICES = 'SET_DEVICES',
    setDevices = state => ({type: SET_DEVICES, ...state})
