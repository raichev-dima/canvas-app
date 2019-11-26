/* istanbul ignore file */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <h1 style={{ color: 'red' }}>
          Something went wrong... Please, try refreshing the page
        </h1>
      );
    }

    return this.props.children;
  }
}

export const ErrorThrower = ({ children }) => {
  throw new Error(children);
};

export default ErrorBoundary;
