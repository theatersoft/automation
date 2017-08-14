import {h, Component} from 'preact'
import {ListItem, Switch} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const
    Settings = proxy('Settings'),
    settingsAction = state => () => Settings.setState(state),
    selectSettings = ({settings}) => ({settings}),
    mapDispatch = dispatch => ({
        dispatch: {
            settings: state => dispatch(settingsAction(state))
        }
    })

export const ServiceSettings = (Composed, {service: {name}}) => connect(selectSettings, mapDispatch)(class ServiceSettings extends Component {
    onClick = e => {
        const
            [, service, id] = /^([^\.]+)\.([^]+)$/.exec(e.currentTarget.dataset.id),
            value = this.props[service][id]
        this.props.dispatch[service]({[id]: !value})
    }

    onChange = (value, e) => this.onClick(e)

    render ({settings, dispatch, ...props}) {
        const
            item = (label, value, id) =>
                <ListItem label={label}>
                    <Switch checked={value} data-id={id} onChange={this.onChange}/>
                </ListItem>
        return (
            <Composed {...props}>
                {item('Alarm armed', settings.armed, 'settings.armed')}
            </Composed>
        )
    }
})
