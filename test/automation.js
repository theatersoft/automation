'use strict'
const {bus} = require('@theatersoft/bus')
module.exports = {
    start: f => bus.start().then(f),
    automation: new Proxy({}, {get: (_, method) => (...args) => bus.proxy('Automation')[method](...args).then(r => (console.log(method, r), r))})
}