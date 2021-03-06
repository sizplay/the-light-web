import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (CheckedComponent) => {
  class Authenticated extends Component {

    componentWillMount() {
      if(!this.props.user) return null
      if (!this.props.user.id) {
        this.props.history.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.user.id) {
        this.props.history.push('/login');
      }
    }

    render() {
      return <CheckedComponent {...this.props} />;
    }
  }

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user
  };
};

  return connect(mapStateToProps)(Authenticated);
};
