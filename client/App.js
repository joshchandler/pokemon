import React from 'react';
import Flexbox from 'flexbox-react';
import ListView from './components/ListView';

import { Provider } from 'react-redux';

class App extends React.Component {
  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <Flexbox flexDirection='column' width='100vw'>
          <Flexbox>
            <ListView />
          </Flexbox>
        </Flexbox>
      </Provider>
    )
  }
}

export default App
