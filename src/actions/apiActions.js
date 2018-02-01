import {serviceId} from '@theatersoft/device'
import {services} from '../lib'

export const
    api = action => () => {
        const
            {id, type} = action,
            [service] = serviceId(id)
        services[service].get(id)[type](action)
    }
