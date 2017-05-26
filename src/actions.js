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

let feedTimeout
export const
    SET_FEED = 'SET_FEED',
    setFeed = value => dispatch => {
        if (feedTimeout) clearTimeout(feedTimeout)
        dispatch({type: SET_FEED, value: {...value, active: true}})
        feedTimeout = setTimeout(() => dispatch({type: SET_FEED, value: {...value, active: false}}), 5000)
    }
