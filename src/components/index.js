import {h, Component} from 'preact'
import {ListItem, Switch, Subheader} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const Settings = proxy('Settings')
export const settingsAction = state => () => Settings.setState(state)

const
    mapState = p => p,
    mapDispatch = dispatch => ({
        dispatch: {
            settings: state => dispatch(settingsAction(state))
        }
    })

export const ServiceSettings = (Composed, {service: {name}}) => connect(mapState, mapDispatch)(class ServiceSettings extends Component {
    onClick = e => {
        const
            [, service, id] = /^([^\.]+)\.([^]+)$/.exec(e.currentTarget.dataset.id),
            value = this.props[service][id]
        this.props.dispatch[service]({[id]: !value})
    }

    onChange = (value, e) => this.onClick(e)

    render ({settings}) {
        const
            item = (label, value, id) =>
                <ListItem label={label}>
                    <Switch checked={value} data-id={id} onChange={this.onChange}/>
                </ListItem>
        return (
            <Composed>
                <Subheader label={`${name} Service Settings`}/>
                {item('Alarm armed', settings.armed, 'settings.armed')}
            </Composed>
        )
    }
})
