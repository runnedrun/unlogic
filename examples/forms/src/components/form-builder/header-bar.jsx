/**
  * <HeaderBar />
  */

import React from 'react';

export default class HeaderBar extends React.Component {
  render() {
    return (
      <div className="toolbar-header">

        <div className="toolbar-header-buttons">
          { this.props.data.element !== 'LineBreak' &&
            <div className="btn is-isolated btn-school" onClick={(e) => this.props.editModeOn(this.props.data, e)}><i className="is-isolated fa fa-pencil-square-o"></i></div>
          }
          <div className="btn is-isolated btn-school" onClick={(e) => this.props.onDestroy(this.props.data, e)}><i className="is-isolated fa fa-trash-o"></i></div>
        </div>
      </div>
    );
  }
}
