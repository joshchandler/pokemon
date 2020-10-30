import React from 'react';
import Flexbox from 'flexbox-react';
import ListView from './components/ListView';
import Dexie from "dexie";

import { Provider } from 'react-redux';

class App extends React.Component {
  async componentDidMount() {
    const db = new Dexie('Pokemon');

    db.version(1).stores({
      bag: '++id, name',
    });

    await db.open();
  }

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
