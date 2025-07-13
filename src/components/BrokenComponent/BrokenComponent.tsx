import { Component } from 'react';

class BrokenComponent extends Component<unknown> {
  constructor(props: unknown) {
    super(props);

    throw new Error('');
  }

  render() {
    return null;
  }
}

export default BrokenComponent;
