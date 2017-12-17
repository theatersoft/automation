'use strict'
require('@theatersoft/server/lib').startLocalService({
    module: '@theatersoft/automation',
    export: 'Automation',
    name: 'Automation',
    config: {
        remotedev: 'localhost'
    }
})
