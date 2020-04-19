/**
 * <Preview />
 */

import React from 'react'
import update from 'immutability-helper'
import FormElementsEdit from './form-elements-edit'
import SortableFormElements from './sortable-form-elements'
import { withStyles } from '@material-ui/core/styles'

const { PlaceHolder } = SortableFormElements

class Preview extends React.Component {
  constructor(props) {
    super(props)

    this.editForm = React.createRef()
    this.seq = 0

    this.moveCard = this.moveCard.bind(this)
    this.insertCard = this.insertCard.bind(this)
  }

  componentDidMount() {
    const { data, url, saveUrl } = this.props
    document.addEventListener('mousedown', this.editModeOff)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.editModeOff)
  }

  editModeOff = e => {
    if (this.editForm.current && !this.editForm.current.contains(e.target)) {
      this.manualEditModeOff()
    }
  }

  manualEditModeOff = () => {
    const { editElement } = this.props
    if (editElement && editElement.dirty) {
      editElement.dirty = false
      this.updateElement(editElement)
    }
    this.props.manualEditModeOff()
  }

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
  }

  updateElement(element) {
    const data = this.props.data
    let found = false

    for (let i = 0, len = data.length; i < len; i++) {
      if (element.id === data[i].id) {
        data[i] = element
        found = true
        break
      }
    }

    if (found) {
      this.seq = this.seq > 100000 ? 0 : this.seq + 1
      this.props.store.dispatch('updateOrder', data)
    }
  }

  _onChange(data) {
    const answerData = {}

    data.forEach(item => {
      if (item && item.readOnly && this.props.variables[item.variableKey]) {
        answerData[item.field_name] = this.props.variables[item.variableKey]
      }
    })

    this.props.setAnswers && this.props.setAnswers(answerData)
  }

  _onDestroy(item) {
    this.props.store.dispatch('delete', item)
  }

  insertCard(item, hoverIndex) {
    const data = this.props.data
    data.splice(hoverIndex, 0, item)
    this.saveData(item, hoverIndex, hoverIndex)
  }

  moveCard(dragIndex, hoverIndex) {
    const data = this.props.data
    const dragCard = data[dragIndex]
    this.saveData(dragCard, dragIndex, hoverIndex)
  }

  // eslint-disable-next-line no-unused-vars
  cardPlaceHolder(dragIndex, hoverIndex) {
    // Dummy
  }

  saveData(dragCard, dragIndex, hoverIndex) {
    const newData = update(this.props.data, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    })

    this.props.store.dispatch('updateOrder', newData)
  }

  getElement(item, index) {
    const SortableFormElement = SortableFormElements[item.element]
    return (
      <SortableFormElement
        id={item.id}
        seq={this.seq}
        index={index}
        moveCard={this.moveCard}
        insertCard={this.insertCard}
        mutable={false}
        parent={this.props.parent}
        editModeOn={this.props.editModeOn}
        isDraggable={true}
        key={item.id}
        sortData={item.id}
        data={item}
        _onDestroy={this._onDestroy.bind(this)}
      />
    )
  }

  render() {
    let classes = this.props.className
    if (this.props.editMode) {
      classes += ' is-editing'
    }
    const data = this.props.data.filter(x => !!x)
    const items = data.map((item, index) => this.getElement(item, index))
    return (
      <div className={`${classes} ${this.props.classes.preview}`}>
        <div className="edit-form" ref={this.editForm}>
          {this.props.editElement !== null && (
            <FormElementsEdit
              showCorrectColumn={this.props.showCorrectColumn}
              files={this.props.files}
              manualEditModeOff={this.manualEditModeOff}
              preview={this}
              element={this.props.editElement}
              updateElement={this.updateElement}
            />
          )}
        </div>
        <div className="Sortable">{items}</div>
        <PlaceHolder
          id="form-place-holder"
          show={items.length === 0}
          index={items.length}
          moveCard={this.cardPlaceHolder}
          insertCard={this.insertCard}
        />
      </div>
    )
  }
}
Preview.defaultProps = {
  showCorrectColumn: false,
  files: [],
  editMode: false,
  editElement: null,
  className: 'react-form-builder-preview pull-left',
}

export default withStyles({ preview: { width: '100% !important' } })(Preview)
