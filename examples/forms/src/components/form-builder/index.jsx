/**
 * <ReactFormBuilder />
 */

import React from 'react'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Preview from './preview'
import Toolbar from './toolbar'
import ReactFormGenerator from './form'
import store from './stores/store'
import Grid from '@material-ui/core/Grid'

class ReactFormBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      editElement: null,
    }
  }

  editModeOn(data, e) {
    e.preventDefault()
    e.stopPropagation()
    if (this.state.editMode) {
      this.setState({ editMode: !this.state.editMode, editElement: null })
    } else {
      this.setState({ editMode: !this.state.editMode, editElement: data })
    }
  }

  manualEditModeOff() {
    if (this.state.editMode) {
      this.setState({
        editMode: false,
        editElement: null,
      })
    }
  }

  render() {    
    const toolbarProps = {}
    toolbarProps.store = this.props.store
    if (this.props.toolbarItems) {
      toolbarProps.items = this.props.toolbarItems
    }
    return (
      <DndProvider backend={HTML5Backend}>
        <Grid container direction="row" spacing={4}>
          {/* <div>
           <p>
             It is easy to implement a sortable interface with React DnD. Just make
             the same component both a drag source and a drop target, and reorder
             the data in the <code>hover</code> handler.
           </p>
           <Container />
         </div> */}
          <Grid className="react-form-builder" item xs={8}>
            <Preview
              files={this.props.files}
              manualEditModeOff={this.manualEditModeOff.bind(this)}
              showCorrectColumn={this.props.showCorrectColumn}
              parent={this}
              data={this.props.data}
              url={this.props.url}
              saveUrl={this.props.saveUrl}
              onLoad={this.props.onLoad}
              onPost={this.props.onPost}
              editModeOn={this.editModeOn.bind(this)}
              editMode={this.state.editMode}
              variables={this.props.variables}
              editElement={this.state.editElement}
              store={this.props.store}
            />
          </Grid>
          <Grid xs={4} item>
            <Toolbar {...toolbarProps} />
          </Grid>
        </Grid>
      </DndProvider>
    )
  }
}

const FormBuilders = {}
FormBuilders.ReactFormBuilder = ReactFormBuilder
FormBuilders.ReactFormGenerator = ReactFormGenerator

export default FormBuilders

export { ReactFormBuilder, ReactFormGenerator }
