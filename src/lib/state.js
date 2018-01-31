export const
    equal = (a, b, _a = Object.keys(a), _b = Object.keys(b)) => (
        _a.length === _b.length && !_a.find(k => !_b.includes(k) || a[k] !== b[k])
    ),
    dedup = (getState, _state = {}) => f => (_next = getState()) => {
        if (!equal(_next, _state)) {
            _state = _next
            f(_next)
        }
    },
    prev = (getState, _prev = {}) => f => (_state = getState()) => {
        f(_state, _prev)
        _prev = _state
    },
    diffValues = (a, b) => b && a.value !== b.value,
    diffs = (state, prev) => Object.entries(state).reduce((o, [k, v]) => {
        if (typeof v.value !== 'object' && diffValues(v, prev[k])) o[k] = v
        return o
    }, {})