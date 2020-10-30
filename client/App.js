import React from 'react';
import Flexbox from 'flexbox-react';
import { Provider } from 'react-redux';
import Dexie from 'dexie';

import ListView from './components/ListView';

import configureStore from './configureStore';

const initialState = window.initialReduxState;
const store = configureStore(initialState);

const db = new Dexie('Pokemon');

db.version(1).stores({
  bag: '++id,name,url,image',
});
db.open();

class App extends React.Component {
  render() {

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
