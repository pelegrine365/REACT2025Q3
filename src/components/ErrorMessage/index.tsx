import { Component } from 'react';

import './index.css';

interface ErrorMessageProps {
  message: string;
}

export class ErrorMessage extends Component<ErrorMessageProps> {
  render() {
    return <div className="error-message">{this.props.message}</div>;
  }
}

export default ErrorMessage;
