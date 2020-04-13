const React = require('React')
const _ = require('underscore')

module.exports.WithData = Component => {
  return class newComponent extends React.Component {
    constructor(props) {
      super(props)
      this.subscriptions = {}
      this.state = { data: {} }
      this.dataSources = {}
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
          if (prop.subscribe && !prop.__withDataMounted) {
            console.log('mounding??')
            prop.__withDataMounted = true
            return new Promise(resolve => {
              this.dataSources[propName] = prop
              this.subscriptions[propName] = prop.subscribe(result => {
                this.setState(state => {
                  console.log('setting agian?', result)
                  state.data[propName] = result
                  return state
                })
                resolve()
              })
            })
          } else {
            return Promise.resolve({})
          }
        })
      )

      allDataSourcesMounted.then(() => {
        !this.state.allDataSourcesMounted &&
          this.setState({ allDataSourcesMounted: true })
      })
    }

    unmountDataSources() {
      Object.keys(this.subscriptions).forEach(propName =>
        this.DataSources[propName].unsubscribe()
      )
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
