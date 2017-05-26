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
    SET_DEVICE = 'SET_DEVICE',
    setDevice = state => ({type: SET_DEVICE, ...state})

export const
    SET_FEED = 'SET_FEED',
    setFeed = value => ({type: SET_FEED, value})
