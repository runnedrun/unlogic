import React from 'react';

export default class extends React.Component {
  static defaultProps = {
    className: 'rfb-item',
  };

  state = {
    changedValue: this.props.data.value,
    data: this.props.data,
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
