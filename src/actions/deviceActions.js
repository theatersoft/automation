import {proxy} from '@theatersoft/bus'

const Device = proxy('Device')
export const deviceAction = action => () => Device.dispatch(action)