export const
    SET_DEVICE_DEVICES = 'SET_DEVICE_DEVICES',
    setDeviceDevices = ({devices}) => ({type: SET_DEVICE_DEVICES, devices}),
    SET_SETTINGS = 'SET_SETTINGS',
    setSettings = settings => ({type: SET_SETTINGS, settings}),
    DEVICE_SET = 'DEVICE_SET',
    deviceSet = device => ({type: DEVICE_SET, device}),
    DEVICE_VALUE_SET = 'DEVICE_VALUE_SET',
    deviceValueSet = (id, value) => ({type: DEVICE_VALUE_SET, id, value, time: Date.now()})
