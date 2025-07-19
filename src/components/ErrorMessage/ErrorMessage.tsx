import { Component } from 'react';

import './index.css';

interface ErrorMessageProps {
  message: string;
}

export class ErrorMessage extends Component<ErrorMessageProps> {
  render() {
    return (
      <div className="error-message" role="alert">
        {this.props.message || 'Opppps, something went wrong!'}
      </div>
    );
  }
}

export default ErrorMessage;
