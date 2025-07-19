import { Component } from 'react';

import './index.css';

export class Spinner extends Component {
  render() {
    return (
      <div className="spinner" role="status" aria-label="Loading..."></div>
    );
  }
}

export default Spinner;
