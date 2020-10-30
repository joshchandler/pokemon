import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import configureStore from './configureStore';
import "./index.css";

const initialState = window.initialReduxState;
const store = configureStore(initialState);

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root'),
);