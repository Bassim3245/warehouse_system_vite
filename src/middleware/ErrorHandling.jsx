import React, { Component } from "react";
class GlobalErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
  
    componentDidCatch(error, info) {
      this.setState({ hasError: true, error });
      // Log the error or send it to a logging service
      console.error(error);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Something went wrong: {this.state.error.message}</div>;
      }
      return this.props.children;
    }
  }
  export default GlobalErrorBoundary;