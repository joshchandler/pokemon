import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import { rootReducer, rootSaga } from './store';

export default function configureStore(initialState) {
	const composeEnhancers = composeWithDevTools({});
	const sagaMiddleware = createSagaMiddleware();

	// We'll create our store with the combined reducers/sagas, and the initial Redux state that
	// we'll be passing from our entry point.
	const store = createStore(
		rootReducer,
		initialState,
		composeEnhancers(applyMiddleware(sagaMiddleware))
	);

	// Don't forget to run the root saga, and return the store object.
	sagaMiddleware.run(rootSaga);

	return store;
}
