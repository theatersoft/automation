import {Type, Interface, interfaceOfType} from '@theatersoft/device'

export const
    INIT = 'INIT',
    init = () => ({type: INIT})

import {log} from './log'

export const
    API = 'API',
    api = action => (dispatch, getState) => {
    }