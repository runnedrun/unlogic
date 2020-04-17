const React = require('React')
const _ = require('underscore')
import { v4 as uuidv4 } from 'uuid'

module.exports.WithData = Component => {
  return class newComponent extends React.Component {
    constructor(props) {
      super(props)
      this.subscriptions = {}
      this.state = { data: {} }
      this.dataSources = {}
      this.mountedForProp = {}
      this.lastMountingPromise = Promise.resolve()
    }

    componentDidMount() {
      this.mountDataSources()
    }

    componentDidUpdate() {
      this.mountDataSources()
    }

    componentWillUnmount() {
      this.unmountDataSources()
    }

    mountDataSources() {
      const allDataSourcesMounted = Promise.all(
        Object.keys(this.props).map(propName => {
          const prop = this.props[propName]
          prop.__uuid = prop.__uuid || uuidv4()
          if (prop && prop.subscribe && !this.mountedForProp[prop.__uuid]) {
            this.mountedForProp[prop.__uuid] = true
            return new Promise(resolve => {
              this.dataSources[propName] = prop
              this.subscriptions[propName] = prop.subscribe(result => {
                prop.firstResultReturned = true
                this.setState(state => {
                  state.data[propName] = result
                  return state
                })
                resolve()
              })
            })
          } else {
            return Promise.resolve()
          }
        })
      )

      this.lastMountingPromise = this.lastMountingPromise.then(() =>
        allDataSourcesMounted.then(() => {
          !this.state.allDataSourcesMounted &&
            this.setState({ allDataSourcesMounted: true })
        })
      )
    }

    unmountDataSources() {
      Object.keys(this.subscriptions).forEach(propName => {
        this.subscriptions[propName].unsubscribe()
        this.dataSources[propName].__withDataMounted = false
      })
    }

    render() {
      if (this.state.allDataSourcesMounted) {
        return (
          <Component
            {...this.props}
            {...this.state.data}
            dataSources={this.dataSources}
          />
        )
      } else {
        return (
          <div style={{ display: 'inline' }} className="withdata-loading" />
        )
      }
    }
  }
}
