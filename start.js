const
    {startLocalService} = require('@theatersoft/server/lib'),
    task = process.argv[2],
    service = task ? {
        module: '@theatersoft/automation',
        export: 'Automation',
        name: `Automation.${task}`,
        config: {[task]: true}
    } : 'Automation'
startLocalService(service)
