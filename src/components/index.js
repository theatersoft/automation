import {h, Component} from 'preact'
import {ListItem, Switch} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const Settings = proxy('Settings')
export const settingsAction = state => () => Settings.setState(state)

const
    mapStateToProps = p => p,
    mapDispatchToProps = dispatch => ({
        dispatch: {
            settings: state => dispatch(settingsAction(state))
        }
    })

export const ServiceItems = (ComposedComponent, props) => connect(mapStateToProps, mapDispatchToProps)(class extends Component {
    state = {add: false}

    onClick = e => {
        const
            [, service, id] = /^(\w+)\.(\w+)$/.exec(e.currentTarget.dataset.id),
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
            <ComposedComponent {...props}>
                {item('Alarm armed', settings.armed, 'settings.armed')}
            </ComposedComponent>
        )
    }
})