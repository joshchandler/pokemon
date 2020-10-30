import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";

import pokemon from "./pokemon";

export const actions = {
	...pokemon.actions,
};

export const rootReducer = combineReducers({
	pokemon: pokemon.reducer,
});

export function* rootSaga() {
	yield all([
		fork(pokemon.sagas),
	]);
}
