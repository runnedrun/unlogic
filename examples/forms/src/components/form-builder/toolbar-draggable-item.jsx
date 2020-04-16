/**
 * <ToolbarItem />
 */

import React from 'react'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'
import ID from './UUID'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'

const cardSource = {
  beginDrag(props) {
    return {
      id: ID.uuid(),
      index: -1,
      data: props.data,
      onCreate: props.onCreate,
    }
  },
}

class ToolbarItem extends React.Component {
  render() {
    const { connectDragSource, data, onClick } = this.props
    if (!connectDragSource) return null
    return connectDragSource(
      <div>
        <ListItem divider dense onClick={onClick}>
          <ListItemIcon>
            <i className={data.icon}></i>
          </ListItemIcon>
          <ListItemText>{data.name}</ListItemText>
        </ListItem>
      </div>
    )
  }
}

export default DragSource(ItemTypes.CARD, cardSource, connect => ({
  connectDragSource: connect.dragSource(),
}))(ToolbarItem)
