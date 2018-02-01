export * from './storeActions'
export * from './apiActions'
export * from './deviceActions'

import {deviceSet} from './storeActions'
let feedTimeout
export const
    setFeed = value => dispatch => {
        const feedSet = (value, active) => deviceSet({id: 'feed', value: {...value, active}})
        if (feedTimeout) clearTimeout(feedTimeout)
        dispatch(feedSet(value, true))
        feedTimeout = setTimeout(() => dispatch(feedSet(value, false)), 5000)
    }
