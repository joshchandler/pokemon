import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Dexie from 'dexie';

import configureStore from './configureStore';
import "./index.css";

const initialState = window.initialReduxState;
const store = configureStore(initialState);

const db = new Dexie('Pokemon');

db.version(1).stores({
  bag: '++id,name,url,image',
});
db.open();

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root'),
);